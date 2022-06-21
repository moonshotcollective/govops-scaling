import { Col, notification, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProposalDetail = ({ readContracts, writeContracts, address, tx, ...props }) => {
  const [amount, setAmount] = useState(0);
  const [isGaugeExecutable, setIsGaugeExecutable] = useState(false);
  const [gaugeId, setGaugeId] = useState(1);
  const [gaugeDetails, setGaugeDetails] = useState({});
  const [totalStakedForProposal, setTotalStakedForProposal] = useState(0);
  const [proposalId, setProposalId] = useState();

  let { id } = useParams();

  useEffect(() => {
    let propId = id;
    setProposalId(propId);
    console.log("proposal id from url", id);
  }, [address]);

  // Adding a new gauge when a proposal is added.. how are we to deal with the gas??
  const addProposalGauge = async threshold => {
    //setLoadingGauge(true);
    await tx(writeContracts?.ConvictionVoting?.addGauge(threshold), async update => {
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
          message: `Gauge added for proposal ${proposalId}`,
        });
      }
    });
    //setLoadingGauge(false);
  };

  // Adding conviction to a propsal
  const addConviction = async () => {
    await tx(writeContracts?.ConvictionVoting?.addConviction(address, proposalId, amount), async update => {
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
          message: `Your conviction has been added to propsal ${id}`,
        });
      }
    });
  };

  // Removing conviction from a proposal
  const removeAllConvictions = async () => {
    await tx(
      writeContracts?.ConvictionVoting?.removeAllConvictions(
        proposalId, // proposalId
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
            message: `All your conviction has been removed for proposal ${proposalId}`,
          });
        }
      },
    );
  };

  // On-chain functions
  const checkIsGaugeExecutable = id => {
    readContracts?.ConvictionVoting?.isGaugeExecutable(id).then(response => {
      console.log(response);
      setIsGaugeExecutable(response);
    });
  };
  // checkIsGaugeExecutable(1);

  return (
    <div>
      <Row>
        <Col span={24}>
          <span>Proposal {id}</span>
        </Col>
      </Row>
    </div>
  );
};

export default ProposalDetail;
