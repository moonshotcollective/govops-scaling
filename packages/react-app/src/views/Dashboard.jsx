import { Col, Row } from "antd";
import React from "react";

const Dashboard = ({ readContracts, writeContracts, address, tx, ...props }) => {
  return (
    <div>
      <Row>
        <Col span={8}>Testing</Col>
        <Col span={8}></Col>
        <Col span={8}></Col>
      </Row>
    </div>
  );
};

export default Dashboard;
