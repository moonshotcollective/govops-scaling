import { Col, Row } from "antd";
import React, { useState } from "react";

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

export default Option;
