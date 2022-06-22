import { Col, Modal, Row } from "antd";
import React from "react";
import { ethers } from "ethers";

const ConvictionModal = ({ isVisible, handleOk, handleCancel, proposal, cgtcbalance, submitConviction }) => {
  return (
    <Modal title="Your Conviction" visible={isVisible} onCancel={handleCancel} onOk={submitConviction} okText="Submit">
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
          return <Option values={item} />;
        })}
      </div>
    </Modal>
  );
};

const Option = ({ values }) => {
  return (
    <Row className="m-9">
      <Col span={24}>
        <span className="mr-2">Option {values.id}</span>
        <input />
        <span className="ml-2">CGTC</span>
      </Col>
    </Row>
  );
};

export default ConvictionModal;
