import { Button, Card, Col, Divider, List, notification, Row, Switch } from "antd";
import React, { useEffect, useState } from "react";

const Dashboard = ({ readContracts, writeContracts, address, tx, ...props }) => {
  const [users, setUsers] = useState([
    // mock users - not sure what I was doing here yet...
    { address: address, score: 75 },
    { address: address, score: 57 },
  ]);
  const [currentGaugeId, setCurrentGaugeId] = useState(0);
  const [gauges, setGauges] = useState([
    // mock gauges
    // { id: 1, score: 0 },
    // { id: 2, score: 0 },
    // { id: 3, score: 0 },
    // { id: 4, score: 0 },
  ]);
  const [action, setAction] = useState(true);
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [approval, setApproval] = useState(0);
  const [lengthOfTime, setLengthOfTime] = useState(0);
  const [proposalId, setProposalId] = useState();
  const [score, setScore] = useState([{ id: 1, score: 0 }]);

  const onSwitchChange = e => {
    setAction(e);
  };

  const addGauge = async () => {
    await tx(writeContracts?.ConvictionVoting?.addGauge(), async update => {
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

  const addConviction = async () => {
    await tx(writeContracts?.ConvictionVoting?.addConviction(address, currentGaugeId, amount), async update => {
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

  const submitConviction = async action => {
    if (action === true) {
      await addConviction();
    } else if (action === false) {
      // await removeConviction();
    }
  };

  const getConvictionScoreForGaugeWithId = async () => {
    // fetch the current total conviction score for a gauge
    await readContracts?.ConvictionVoting?.calculateConvictionScoreForGauge(currentGaugeId).then(x => {
      console.log("Score for gauge: ", x.toString());

      return x.toString();
    });
  };

  useEffect(() => {
    const getConvictionScoreForGauge = async gaugeId => {
      // fetch the current total conviction score for a gauge
      await readContracts?.ConvictionVoting?.calculateConvictionScoreForGauge(currentGaugeId).then(x => {
        console.log("Score for gauge: ", currentGaugeId, x.toString());
        // setGauges([{ id: currentGaugeId, score: x.toString() }]);
      });
    };

    return () => {
      getConvictionScoreForGauge();
    };
  }, [currentGaugeId, readContracts?.ConvictionVoting]);

  useEffect(() => {
    const getApprovedAmount = async () => {
      await readContracts?.GTC?.allowance(address, readContracts?.ConvictionVoting?.address).then(r => {
        console.log("Allowance for CV: ", r.toString());
        setApproval(r.toString());
      });
    };

    return () => {
      getApprovedAmount();
    };
  }, [address, readContracts?.ConvictionVoting, readContracts?.GTC]);

  useEffect(() => {
    const getGaugeInfo = async () => {
      await readContracts?.ConvictionVoting?.currentGaugeId().then(async r => {
        for (let index = 1; index < r.toString(); index++) {
          await readContracts?.ConvictionVoting?.calculateConvictionScoreForGauge(index).then(rslt => {
            console.log(rslt.toString());
            setGauges([{ id: index, score: rslt.toString() }]);
          });
        }
      });
    };

    return () => {
      getGaugeInfo();
    };
  }, [address, readContracts?.ConvictionVoting]);

  return (
    <div style={{ margin: "20px" }}>
      <Divider>Show Your Conviction</Divider>
      <Row align="center">
        <Col span={6} style={{ border: "1px solid", margin: "20px", padding: "25px" }}>
          <span>Current Gauge {currentGaugeId === 0 ? "Not Selected" : currentGaugeId}</span>
          <br />
          <Button className="mt-56 bg-purple-700 hover:bg-purple-300" onClick={() => addGauge()}>
            Add Gauge
          </Button>
        </Col>
        <Col span={12} style={{ border: "1px solid", margin: "20px", padding: "25px" }}>
          <Switch
            className="right-9 m-4 bg-purple-600"
            checkedChildren="Stake"
            unCheckedChildren="Unstake"
            defaultChecked
            onChange={onSwitchChange}
          />
          <span className="m-5">{action === true ? "Stake" : "Unstake"} Your Conviction</span>
          <br />
          <label>Gauge Id: </label>
          <input
            className="w-60 m-4 bg-transparent border-2 p-1"
            value={proposalId}
            onChange={e => {
              setProposalId(e.target.value);
            }}
          />
          <br />
          <label>Amount: </label>
          <input
            className="w-60 m-4 bg-transparent border-2 p-1"
            value={amount}
            onChange={e => {
              setAmount(e.target.value);
            }}
          />
          <br />
          {/* <label>Length of Time: </label>
          <Input
            value={lengthOfTime}
            onChange={e => {
              setLengthOfTime(e.target.value);
            }}
          />
          <br /> */}
          {!approval > 0 ? (
            <Button
              className="mt-10 bg-purple-700 hover:bg-purple-300"
              loading={loading}
              onClick={() => submitConviction(action)}
            >
              Submit
            </Button>
          ) : (
            <Button className="mt-10 bg-purple-700 hover:bg-purple-300" loading={loading}>
              Approve
            </Button>
          )}
        </Col>
      </Row>
      <Divider>Gauges</Divider>
      <Row>
        <Col span={24}>
          <List
            grid={{ gutter: 16, column: 4 }}
            dataSource={gauges}
            renderItem={item => (
              <List.Item>
                <Card
                  className="cursor-pointer"
                  title={"Gauge Id: " + item.id}
                  onClick={e => {
                    setProposalId(item.id);
                    setCurrentGaugeId(item.id);
                  }}
                >
                  Total Gauge Score: {() => getConvictionScoreForGaugeWithId(item.id)}
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
