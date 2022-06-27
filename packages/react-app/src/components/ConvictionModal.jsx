import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Col, Modal, Row, Switch } from "antd";
import { ethers } from "ethers";
import React, { useState } from "react";

const ConvictionModal = ({ isVisible, handleOk, handleCancel, proposal, cgtcbalance, submitConviction, allowance }) => {
  // todo: update the staked values offchain
  const updateValuesCallback = async id => {};

  const [action, setAction] = useState(true);
  const [option, setOption] = useState("");

  const onSwitchChange = e => {
    setAction(e);
  };

  return (
    <Modal
      title="Your Conviction"
      visible={isVisible}
      onCancel={handleCancel}
      okText="Submit"
      okButtonProps={{
        onClick: () => {
          submitConviction(action, option);
        },
        style: { width: "400px" },
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
            Your CGTC Balance: {ethers.utils.formatEther(cgtcbalance.toString())}
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
            Your CGTC Balance: {ethers.utils.formatEther(cgtcbalance.toString())}
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
            updateValuesCallback(values.id);
          }}
        />
        <span className="ml-2">CGTC</span>
      </Col>
    </Row>
  );
};

export default ConvictionModal;
