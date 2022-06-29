import { Col, Modal, Row } from "antd";
import React, { useState } from "react";
// import { OptionEditor } from "../components";

const OptionModal = ({ isVisible, handleCancel, proposal, submitOption, allowance }) => {
  // todo: update the staked values offchain
  const updateValuesCallback = async id => {};

  const [option, setOption] = useState({ title: "" });

  return (
    <Modal
      title="Add New Option"
      visible={isVisible}
      onCancel={handleCancel}
      okText="Submit"
      okButtonProps={{
        onClick: () => {
          submitOption(option);
        },
        style: { width: "400px" },
      }}
    >
      <div>
        <div id="proposal-title" className="text-left text-2xl m-2 mb-5">
          {proposal.title}
        </div>
        <div className="m-2">
          {/* todo: New Form */}
          <div className="mb-9">
            <span className="mb-2">Option Title</span>
            <br />
            <input id="option-title" className="w-full" value={option.title} />
          </div>
          <div className="mb-9">
            <span className="mb-2">Option Description</span>
            <br />
            <textarea id="option-description" className="w-full text-black" rows="10" value={option.description}>
              Enter details of option here...
            </textarea>
            {/* <OptionEditor />*/}
          </div>
          <div className="mb-9">
            <span className="mb-2">Amount Requested</span>
            <br />
            <span>Amount Requested in GTC</span>
            <br />
            <input id="option-amount-requested" className="w-96" type="text" value={option.amountRequested} />
            {"  "}GTC
          </div>
        </div>
      </div>
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

export default OptionModal;
