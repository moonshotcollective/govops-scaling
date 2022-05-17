import { Card, Col, List, Row } from "antd";
import React, { useEffect, useState } from "react";

const Dashboard = ({ readContracts, writeContracts, address, tx, ...props }) => {
  const [users, setUsers] = useState([
    // mock users
    { address: address, score: 75 },
    { address: address, score: 57 },
  ]);
  const [gauges, setGauges] = useState([{ id: 1 }, { id: 2 }]);

  useEffect(() => {
    const getTotalCovictionForGuage = async () => {
      // fetch the current total conviction score for a gauge
      await tx(readContracts && readContracts.getIntFromMappingForTotalConviction(1)).then(x => {
        console.log("Gauges: ", x);
        setGauges(x);
      });
    };

    return () => {
      getTotalCovictionForGuage();
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
