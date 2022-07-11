import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Col, Modal, Row, Switch } from "antd";
import { ethers } from "ethers";
import React, { useState } from "react";
import { ProposalOptions } from "../components";

const ConvictionModal = ({
  isVisible,
  handleOk,
  handleCancel,
  proposal,
  cgtcBalance,
  submitConviction,
  allowance,
  tx,
  readContracts,
  writeContracts,
  address,
  setAllowance,
  setLoadingApprove,
  getCgtcBalance,
  getGtcBalance,
}) => {
  // todo: update the staked values offchain
  const updateValuesCallback = async option => {
    const optionToUpdate = proposal.options[option];
    console.log("Updating... ", optionToUpdate);
  };

  const [action, setAction] = useState(true);
  const [optionsFunded, setOptionsFunded] = useState([]);

  const onSwitchChange = e => {
    setAction(e);
  };

  const getApprovedAmount = async () => {
    await readContracts?.CGTC?.allowance(address, readContracts?.ConvictionVoting?.address).then(result => {
      console.log("Allowance: ", result.toString());
      setAllowance(result.toString());
    });
  };

  const approveCgtc = async amount => {
    setLoadingApprove(true);
    await tx(writeContracts?.CGTC?.approve(readContracts?.ConvictionVoting?.address, ethers.utils.parseEther(amount)));
    getApprovedAmount();
    getCgtcBalance();
    setLoadingApprove(false);
  };

  return (
    <Modal
      title="Your Conviction"
      visible={isVisible}
      onCancel={handleCancel}
      okText={allowance > 0 ? "Submit" : "Approve"}
      okButtonProps={{
        style: { width: "400px" },
      }}
      onOk={() => {
        if (allowance == 0) {
          approveCgtc("10000");
        } else if (allowance > 0) {
          submitConviction(action, optionsFunded);
        }
      }}
    >
      {action ? (
        <div>
          <Switch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            defaultChecked
            onChange={() => {
              setAction(false);
            }}
          />
          <div id="proposal-title" className="text-center">
            {proposal.title}
          </div>
          <div id="subtitle" className="text-center">
            How much would you like to stake?
          </div>
          <div id="subtitle" className="text-center">
            Your CGTC Balance: {ethers.utils.formatEther(cgtcBalance.toString())}
          </div>
          <div>
            {proposal.options.map((item, index) => {
              return <Option key={index} values={item} updateValuesCallback={updateValuesCallback} />;
            })}
          </div>
        </div>
      ) : (
        <div>
          <Switch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            defaultChecked
            onChange={onSwitchChange}
          />
          <div id="proposal-title" className="text-center">
            {proposal.title}
          </div>
          <div id="subtitle" className="text-center">
            Unstake all of your convictions
          </div>
          <div id="subtitle" className="text-center">
            Your CGTC Balance: {ethers.utils.formatEther(cgtcBalance.toString())}
          </div>
          <div id="subtitle" className="text-center">
            Your Staked CGTC Balance: {ethers.utils.formatEther("0")}
          </div>
        </div>
      )}
    </Modal>
  );
};

const Option = ({ values, updateValuesCallback }) => {
  const [amount, setAmount] = useState(0);

  return (
    <Row className="m-9 text-center">
      <Col span={24}>
        <span className="mr-2">Option {values.id}</span>
        <input
          className="text-black"
          value={amount}
          onChange={e => {
            setAmount(e.target.value);
            updateValuesCallback(0);
          }}
        />
        <span className="ml-2">CGTC</span>
      </Col>
    </Row>
  );
};

export default ConvictionModal;
