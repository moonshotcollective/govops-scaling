import { Card, Col, notification, Row } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { ProposalLane } from "../components";
import { sayHello, getGaugeScore, getSinglePost } from "../helpers";

const server = "http://localhost:4001/api/";

const { Meta } = Card;

//! Developer notes: a gaugeId will equal the proposalId, they are the same.
const Proposals = ({ address, readContracts, writeContracts, tx }) => {
  const status = ["posted", "review", "amended", "readyToVoteSnapshot", "readyToVoteTally", "misc"];

  const [latestPosts, setLatestPosts] = useState();
  const [currentPost, setCurrentPost] = useState();
  const [isGaugeExecutable, setIsGaugeExecutable] = useState(false);
  const [gaugeId, setGaugeId] = useState(1);
  const [proposalId, setProposalId] = useState(1);
  const [amount, setAmount] = useState(0);
  const [gaugeDetails, setGaugeDetails] = useState({});
  const [totalStakedForProposal, setTotalStakedForProposal] = useState(0);
  const [proposals, setProposals] = useState([
    {
      id: 1,
      title: "GR14 Round Structure",
      reviewedBy: [{ steward: "" }],
      posted: "5d ago",
      updated: "",
      version: "1",
      comments: [
        { comment: "", by: "" },
        { comment: "", by: "" },
      ],
      lastComment: { comment: "This is awesome", by: "jaxcoder" },
      status: status[0],
    },
    {
      id: 2,
      title: "KERNEL Budget Request",
      reviewedBy: [{ steward: "" }],
      posted: "3d ago",
      updated: "",
      version: "1",
      comments: [
        { comment: "", by: "" },
        { comment: "", by: "" },
      ],
      lastComment: { comment: "Leeeeettttt's Goooo", by: "gtchase" },
      status: status[1],
    },
  ]);

  const server = "http://localhost:4001/api/";

  // On-chain functions
  const checkIsGaugeExecutable = id => {
    readContracts?.ConvictionVoting?.isGaugeExecutable(id).then(response => {
      console.log(response);
      setIsGaugeExecutable(response);
    });
  };
  // checkIsGaugeExecutable(1);

  // Adding a new gauge when a proposal is added.. how are we to deal with the gas??
  const addGauge = async threshold => {
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
    await tx(writeContracts?.ConvictionVoting?.addConviction(address, gaugeId, amount), async update => {
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
          message: `Your conviction has been added to propsal ${proposalId}`,
        });
      }
    });
  };

  // Removing conviction from a proposal
  const removeAllConvictions = async () => {
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
            message: `All your conviction has been removed for proposal ${proposalId}`,
          });
        }
      },
    );
  };

  // Gauge information
  const totalStaked = async () => {
    await readContracts?.ConvictionVoting?.totalStakedForGauge(proposalId).then(result => {
      console.log(result.toString());
      setTotalStakedForProposal(result);
    });
  };

  const getGaugeDetails = async () => {
    await readContracts?.ConvictionVoting?.getGaugeDetails(proposalId).then(result => {
      setGaugeDetails(result);
    });
  };

  // Discourse integration
  // useEffect(() => {
  //   getLatestPosts().then(result => {
  //     console.log("test response: ", result.data);
  //     setLatestPosts(result.data);
  //   });
  // }, [address]);

  const getPost = async id => {
    await getSinglePost(id).then(res => {
      console.log("single post", res);
      setCurrentPost(res);
    });
  };

  //getPost("27410");

  const getProposals = async () => {
    try {
      const proposalResponse = await axios.get(server + "/api/proposals");
      if (proposalResponse.data.success) {
        setProposals(proposalResponse.data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // getProposals();

  sayHello();
  getGaugeScore(1);

  return (
    <div className="">
      <Row className="p-1">
        <Col className="p-1" span={12}>
          <Row>
            <Col span={8}>
              <span className="text-left text-6xl">Proposals</span>
            </Col>
            <Col span={8}></Col>
            <Col span={8}></Col>
          </Row>
          <Row>
            <Col span={8}>test</Col>
            <Col span={8}></Col>
            <Col span={8}></Col>
          </Row>
        </Col>
        <Col className="p-1 border-2" span={12}>
          sorting/filters
        </Col>
      </Row>
      <Row className="p-2 h-screen border-2 border-purple-700 rounded bg-purple-700">
        <ProposalLane title="Posted" proposals={proposals} status="posted" />
        <ProposalLane title="In Review" proposals={proposals} status="review" />
        <ProposalLane title="Amended" proposals={proposals} status="amended" />
        <ProposalLane title="Ready To Vote Snapshot" proposals={proposals} status="readyToVoteSnapshot" />
        <ProposalLane title="Ready To Vote Tally" proposals={proposals} status="readyToVoteTally" />
      </Row>
    </div>
  );
};

export default Proposals;
