import { Col, Row } from "antd";
import React from "react";

const ProposalOptions = ({ option }) => {
  return (
    <>
      <Row className="mt-8">
        <Col span={24}>Option {option}</Col>
      </Row>
      <Row>
        <Col span={24}>
          <span>123,456 GTC</span>
        </Col>
      </Row>
      <Row>
        <Col span={16}>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua.
          </p>
        </Col>
        <Col span={8}>
          {/* This will be a progress bar */}
          <span>Current Conviction</span>
        </Col>
      </Row>
    </>
  );
};

export default ProposalOptions;
