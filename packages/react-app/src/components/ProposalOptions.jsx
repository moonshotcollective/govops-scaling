import { Col, Divider, Progress, Row } from "antd";
import React from "react";

const ProposalOptions = ({ options }) => {
  return (
    <>
      {options.map((item, index) => {
        return (
          <div key={index}>
            <Row className="mt-8">
              <Col span={24}>Option {item.id}</Col>
            </Row>
            <Row>
              <Col span={24}>
                <span>{item.amount} CGTC</span>
              </Col>
            </Row>
            <Row>
              <Col span={15}>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua.
                </p>
              </Col>
              <Col span={7} className="mr-4">
                {/* This will be a progress bar */}
                <Progress
                  strokeColor={{
                    "0%": "#108ee9",
                    "100%": "#87d068",
                  }}
                  percent={item.convictionScore}
                  type="line"
                  size="small"
                  status="active"
                />
              </Col>
            </Row>
            <Divider />
          </div>
        );
      })}
    </>
  );
};

export default ProposalOptions;
