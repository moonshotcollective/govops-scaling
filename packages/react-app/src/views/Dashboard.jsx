import { Button, Card, Col, Divider, List, notification, Row, Switch } from "antd";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { Gauge } from "../components";

const Dashboard = ({ readContracts, writeContracts, address, tx, ...props }) => {
  const [currentGaugeId, setCurrentGaugeId] = useState();
  const [gaugeId, setGaugeId] = useState();
  const [users, setUsers] = useState([{ address: address, gauges: [{ id: 1, score: 0 }] }]);
  const [userScore, setUserScore] = useState(0);
  const [gauges, setGauges] = useState([]);
  const [action, setAction] = useState(true);
  const [amount, setAmount] = useState(0);
  const [loadingGauge, setLoadingGauge] = useState(false);
  const [loadingApprove, setloadingApprove] = useState(false);
  const [loading, setLoading] = useState(false);
  const [approval, setApproval] = useState(0);
  const [lengthOfTime, setLengthOfTime] = useState(0);
  const [score, setScore] = useState(0);
  const [gtcBalance, setGtcBalance] = useState(0);

  const onSwitchChange = e => {
    setAction(e);
  };

  const addGauge = async () => {
    setLoadingGauge(true);
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
    setLoadingGauge(false);
    getGaugeInfo();
  };

  const getConvictionScoreForUser = async () => {
    await readContracts?.ConvictionVoting?.getConvictionScore(gaugeId, address).then(result => {
      console.log("User score for gauge", result);
    });
  };

  const addConviction = async () => {
    setLoading(true);
    await tx(
      writeContracts?.ConvictionVoting?.addConviction(address, gaugeId, ethers.utils.parseEther(amount)),
      async update => {
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
          setAmount(0);
          getGaugeInfo();
        }
      },
    );
    setLoading(false);
  };

  const removeConviction = async id => {
    await tx(
      writeContracts?.ConvictionVoting?.removeAllConvictions(
        gaugeId, // gaugeId
        address, // the reciver of the tokens...
      ),
      async update => {
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
            message: "Your Conviction has been removed for Gauge",
          });
          getGaugeInfo();
        }
      },
    );
  };

  const submitConviction = async action => {
    if (action === true) {
      await addConviction();
      getApprovedAmount();
      getGtcBalance();
    } else if (action === false) {
      await removeConviction();
      getApprovedAmount();
      getGtcBalance();
    }
  };

  const getConvictionScoreForGaugeWithId = async id => {
    // fetch the current total conviction score for a gauge
    await readContracts?.ConvictionVoting?.getConvictionScoreForGauge(id).then(x => {
      console.log("Score for gauge: ", x.toString());
      setScore(x.toString());

      return x.toString();
    });
  };

  const approveGtc = async () => {
    setloadingApprove(true);
    await tx(writeContracts?.GTC?.approve(readContracts?.ConvictionVoting?.address, ethers.utils.parseEther(amount)));
    getApprovedAmount();
    getGtcBalance();
    setloadingApprove(false);
  };

  const getApprovedAmount = async () => {
    await readContracts?.GTC?.allowance(address, readContracts?.ConvictionVoting?.address).then(r => {
      console.log("Allowance for CV: ", r.toString());
      setApproval(r.toString());
    });
  };

  useEffect(() => {
    return () => {
      getApprovedAmount();
    };
  }, [address, readContracts?.ConvictionVoting, readContracts?.GTC]);

  const getGtcBalance = () => {
    readContracts?.GTC?.balanceOf(address ? address : "").then(result => {
      setGtcBalance(result.toString());
    });
  };

  useEffect(() => {
    return () => {
      getGtcBalance();
    };
  }, [address, readContracts?.GTC]);

  useEffect(() => {
    const getCurrentGaugeId = async () => {
      await readContracts?.ConvictionVoting?.currentGaugeId().then(result => {
        setCurrentGaugeId(result.toString());
      });
    };

    return () => {
      getCurrentGaugeId();
    };
  }, [address, readContracts?.ConvictionVoting]);

  // todo: trying to get this to load on the page load... random shit...
  const getGaugeInfo = async () => {
    await readContracts?.ConvictionVoting?.currentGaugeId().then(async gaugeId => {
      console.log("Gauge: ", gaugeId.toString());
      for (let index = 1; index <= gaugeId.toString(); index++) {
        await readContracts?.ConvictionVoting?.getConvictionScoreForGauge(index).then(score => {
          console.log("Score for Gauge ", `${index}: `, score.toString());
          // load up the gauges with the id and the score
          // [{ id: 0, score: 0 }] sample
          setGauges(prevState => {
            return [
              ...prevState.slice(0, index - 1),
              { id: index, score: ethers.utils.formatUnits(score.toString(), 20) },
              ...prevState.slice(index + gaugeId, prevState.length),
            ];
          });
        });
        await readContracts?.ConvictionVoting?.getConvictionScore(index, address).then(userScore => {
          console.log("user score", userScore.toString());
          // [{ address: address, gauges: [{ id: 1, score: 0 }] }]
          setUsers(prevState => {
            return [
              ...prevState.slice(0, index - 1),
              {
                address: address,
                gauges: [{ ...gauges }],
              },
              ...prevState.slice(index + gaugeId, prevState.length),
            ];
          });
        });
      }
      console.log(users);
    });
  };
  useEffect(() => {
    return () => {
      getGaugeInfo();
    };
  }, [approval, address, gaugeId, readContracts?.ConvictionVoting, currentGaugeId]);

  const getTotalStakedForGaugeForUser = async id => {
    await readContracts?.ConvictionVoting?.totalStakedForGaugeByUser(id).then(result => {
      console.log("Staked for a gauge by user: ", result.toString());
    });
  };

  getTotalStakedForGaugeForUser(1);

  return (
    <div style={{ margin: "20px" }}>
      <Divider>Show Your Conviction</Divider>
      <Row align="center">
        <Col span={6} style={{ border: "1px solid", margin: "20px", padding: "25px" }}>
          <span>Current Gauge {gaugeId === 0 ? "Not Selected" : gaugeId}</span>
          <br />
          <div className="">
            Score:{" " + ethers.utils.formatUnits(score, 20)}
            <Gauge value={ethers.utils.formatUnits(score, 20)} className="mt-6" />
          </div>
          {address == "0xA4ca1b15fE81F57cb2d3f686c7B13309906cd37B" ? (
            <Button
              loading={loadingGauge}
              className="mt-5 bg-purple-700 hover:bg-purple-300"
              onClick={() => addGauge()}
            >
              Add Gauge
            </Button>
          ) : (
            <div></div>
          )}
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
          <span>GTC {ethers.utils.formatEther(gtcBalance.toString())}</span>
          <br />
          <label>Gauge Id: </label>
          <input
            className="w-60 m-4 bg-transparent border-2 p-1"
            value={gaugeId}
            onChange={e => {
              setGaugeId(e.target.value);
              getConvictionScoreForGaugeWithId(e.target.value);
            }}
          />
          <br />
          {action === false ? (
            <div></div>
          ) : (
            <div>
              <label>Amount: </label>
              <input
                className="w-60 m-4 bg-transparent border-2 p-1"
                value={amount}
                onChange={e => {
                  setAmount(e.target.value);
                  getApprovedAmount();
                }}
              />
            </div>
          )}
          <br />
          {/* <label>Length of Time: </label>
          <Input
            value={lengthOfTime}
            onChange={e => {
              setLengthOfTime(e.target.value);
            }}
          />
          <br /> */}
          {approval > amount ? (
            <Button
              className="mt-10 bg-purple-700 hover:bg-purple-300"
              loading={loading}
              onClick={() => submitConviction(action)}
            >
              Submit
            </Button>
          ) : (
            <Button
              className="mt-10 bg-purple-700 hover:bg-purple-300"
              loading={loadingApprove}
              onClick={() => {
                approveGtc();
              }}
            >
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
              <List.Item key={item.id}>
                <Card
                  className="cursor-pointer"
                  title={"Gauge Id: " + item.id}
                  onClick={e => {
                    setGaugeId(item.id);
                    getConvictionScoreForGaugeWithId(item.id);
                  }}
                >
                  Total Gauge Score: {item.score}
                  <br />
                  GTC Staked:
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
