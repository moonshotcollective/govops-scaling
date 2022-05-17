import { Card, Col, List, Row } from "antd";
import React, { useEffect, useState } from "react";

const Dashboard = ({ readContracts, writeContracts, address, tx, ...props }) => {
  const [users, setUsers] = useState([
    // mock users
    { address: address, score: 75 },
    { address: address, score: 57 },
  ]);
  const [gauges, setGauges] = useState([]);

  useEffect(() => {
    const getUsersForConvictionScore = async () => {
      // fetch the current users and conviction score for a gauge
      await tx(readContracts && readContracts.getIntFromMapping(1, address)).then(x => {
        console.log("Gauges: ", x);
        setGauges(x);
      });
    };

    return () => {
      getUsersForConvictionScore();
    };
  }, [users]);

  return (
    <div style={{ margin: "20px" }}>
      <Row>
        <Col span={24}>
          <List
            grid={{ gutter: 16, column: 4 }}
            dataSource={users}
            renderItem={item => (
              <List.Item>
                <Card title={item.address}>Card content</Card>
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
