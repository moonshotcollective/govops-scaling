import { Button, Card, Col, Divider, Input, List, notification, Row, Switch } from "antd";
import React, { useEffect, useState } from "react";

const Dashboard = ({ readContracts, writeContracts, address, tx, ...props }) => {
  const [users, setUsers] = useState([
    // mock users
    { address: address, score: 75 },
    { address: address, score: 57 },
  ]);
  const [currentGaugeId, setCurrentGaugeId] = useState();
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
  const [score, setScore] = useState();

  const onSwitchChange = e => {
    setAction(e);
  };

  const addGauge = () => {
    tx(writeContracts?.ConvictionVoting?.addGauge(), async update => {
      if (update && (update.status === "confirmed" || update.status === 1)) {
        console.log(" 🍾 Transaction " + update.hash + " finished!");
        console.log(
          " ⛽️ " +
            update.gasUsed +
            "/" +
            (update.gasLimit || update.gas) +
            " @ " +
            parseFloat(update.gasPrice) / 1000000000 +
            " gwei",
        );
        notification.success({
          placement: "topRight",
          message: "Gauge Added",
        });
      }
    });
  };

  const addConviction = () => {
    tx(writeContracts?.ConvictionVoting?.addConviction(address, currentGaugeId, amount), async update => {
      if (update && (update.status === "confirmed" || update.status === 1)) {
        console.log(" 🍾 Transaction " + update.hash + " finished!");
        console.log(
          " ⛽️ " +
            update.gasUsed +
            "/" +
            (update.gasLimit || update.gas) +
            " @ " +
            parseFloat(update.gasPrice) / 1000000000 +
            " gwei",
        );
        notification.success({
          placement: "topRight",
          message: "Your Conviction is Noted",
        });
      }
    });
  };

  useEffect(() => {
    const getGauges = () => {
      readContracts?.ConvictionVoting?.gauges(1).then(r => {
        console.log("Gauges: ", r);
        setGauges(r);
      });
    };

    return () => {
      getGauges();
    };
  }, [address]);

  useEffect(() => {
    const getConvictionScoreForGauge = async () => {
      // fetch the current total conviction score for a gauge
      await readContracts?.ConvictionVoting?.calculateConvictionScoreForGauge(1).then(x => {
        console.log("Gauges: ", x);
        setScore({ id: 1, score: x });
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
      <Divider>Show Your Conviction</Divider>
      <Row align="center">
        <Col span={6} style={{ border: "1px solid", margin: "20px", padding: "25px" }}>
          <span>Current Gauge {currentGaugeId ?? "Not Selected"}</span>
        </Col>
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
      <Divider>Proposals</Divider>
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
                    setCurrentGaugeId(item.id);
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
