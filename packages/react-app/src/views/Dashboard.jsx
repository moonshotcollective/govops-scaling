import { Button, Card, Col, Input, List, Row, Switch } from "antd";
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
  const [action, setAction] = useState(true);
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [approval, setApproval] = useState(0);
  const [lengthOfTime, setLengthOfTime] = useState(0);
  const [proposalId, setProposalId] = useState();

  const onSwitchChange = e => {
    setAction(e);
  };

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

  useEffect(() => {
    const getApprovedAmount = () => {
      readContracts?.GTC?.allowance(address, readContracts?.ConvictionVoting?.address).then(r => {
        console.log("Allowance for CV: ", r.toString());
        setApproval(r.toString());
      });
    };

    return () => {
      getApprovedAmount();
    };
  }, [address]);

  return (
    <div style={{ margin: "20px" }}>
      <Row align="center">
        <Col span={12} style={{ border: "1px solid", margin: "20px", padding: "25px" }}>
          <Switch
            className=""
            checkedChildren="Stake"
            unCheckedChildren="Unstake"
            defaultChecked
            onChange={onSwitchChange}
          />
          <span className="">{action === true ? "Stake" : "Unstake"} Your Conviction</span>
          <br />
          <label>Proposal Id: </label>
          <Input
            value={proposalId}
            onChange={e => {
              setProposalId(e.target.value);
            }}
          />
          <label>Amount: </label>
          <Input
            value={amount}
            onChange={e => {
              setAmount(e.target.value);
            }}
          />
          <label>Length of Time: </label>
          <Input
            value={lengthOfTime}
            onChange={e => {
              setLengthOfTime(e.target.value);
            }}
          />
          <br />
          {!approval > 0 ? <Button loading={loading}>Submit</Button> : <Button loading={loading}>Approve</Button>}
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <List
            grid={{ gutter: 16, column: 4 }}
            dataSource={gauges}
            renderItem={item => (
              <List.Item>
                <Card
                  title={item.id}
                  onClick={e => {
                    setProposalId(item.id);
                  }}
                >
                  Score: {item.score}
                </Card>
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
