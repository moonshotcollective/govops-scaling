import { Card, Col, List, Row } from "antd";
import React, { useEffect, useState } from "react";

const Dashboard = ({ readContracts, writeContracts, address, tx, ...props }) => {
  const [users, setUsers] = useState([
    // mock users
    { address: address, score: 75 },
    { address: address, score: 57 },
  ]);
  const [gauges, setGauges] = useState([
    // mock gauges
    { id: 1, score: 0 },
    { id: 2, score: 0 },
  ]);

  useEffect(() => {
    const getConvictionScoreForGauge = async () => {
      // fetch the current total conviction score for a gauge
      await readContracts?.ConvictionVoting?.calculateConvictionScoreForGauge(1).then(x => {
        console.log("Gauges: ", x);
        setGauges({ id: 1, score: x });
      });
    };

    return () => {
      getConvictionScoreForGauge();
    };
  }, [address]);

  return (
    <div style={{ margin: "20px" }}>
      <Row>
        <Col span={24}>
          <List
            grid={{ gutter: 16, column: 4 }}
            dataSource={gauges}
            renderItem={item => (
              <List.Item>
                <Card title={item.id}>Score: {item.score}</Card>
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
