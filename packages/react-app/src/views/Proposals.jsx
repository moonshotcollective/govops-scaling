import { Col, Row } from "antd";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { ProposalLane } from "../components";
import { getAllProposalData, getSinglePost } from "../helpers";

const server = "http://localhost:4001/api/";

//! Developer notes: a gaugeId will equal the proposalId
const Proposals = ({ address, readContracts, writeContracts, tx }) => {
  const workstream = ["Public Goods Funding", "MMM", "Moonshot Collective", "FDD", "DAO Operations", "Kernel"];

  const [latestPosts, setLatestPosts] = useState();
  const [currentPost, setCurrentPost] = useState();
  const [posts, setPosts] = useState([]);
  const [proposals, setProposals] = useState([
    {
      id: 1,
      title: "GR14 Round Structure & Grants Eligibility Update",
      author: "annikalewis",
      reviewedBy: [{ steward: "" }],
      posted: "5d ago",
      updated: "",
      version: "1",
      amended: false,
      comments: [
        { comment: "", by: "jaxcoder" },
        { comment: "", by: "kbw" },
      ],
      lastComment: { comment: "This is awesome", by: "jaxcoder" },
      workstream: workstream[0],
      options: [
        { id: "A", amount: 123456, convictionScore: 38 },
        { id: "B", amount: 8765457, convictionScore: 52 },
        { id: "C", amount: 290634, convictionScore: 79 },
        { id: "D", amount: 146794, convictionScore: 85 },
      ],
      contentRaw: "",
    },
    {
      id: 2,
      title: "Decentralize Gitcoin Kudos - budget request",
      author: "cerestation",
      reviewedBy: [{ steward: "kbw" }],
      posted: "3d ago",
      updated: "",
      version: "1",
      amended: false,
      comments: [
        { comment: "", by: "gtchase" },
        { comment: "", by: "kbw" },
        { comment: "", by: "joe" },
      ],
      lastComment: { comment: "Leeeeettttt's Goooo", by: "gtchase" },
      workstream: workstream[1],
      options: [
        { id: "A", amount: 123456, convictionScore: 38 },
        { id: "B", amount: 8765457, convictionScore: 52 },
        { id: "C", amount: 290634, convictionScore: 79 },
        { id: "D", amount: 146794, convictionScore: 85 },
      ],
      contentRaw: "",
    },
    {
      id: 3,
      title: "KERNEL Budget Request of 49K GTC",
      author: "viveksingh",
      reviewedBy: [{ steward: "" }],
      posted: "3d ago",
      updated: "",
      version: "1",
      amended: false,
      comments: [
        { comment: "", by: "emu" },
        { comment: "", by: "jaxcoder" },
      ],
      lastComment: { comment: "Leeeeettttt's Goooo", by: "gtchase" },
      workstream: workstream[5],
      options: [
        { id: "A", amount: 123456, convictionScore: 38 },
        { id: "B", amount: 8765457, convictionScore: 52 },
        { id: "C", amount: 290634, convictionScore: 79 },
        { id: "D", amount: 146794, convictionScore: 85 },
      ],
      contentRaw: "",
    },
  ]);
  const [gtcBalance, setGtcBalance] = useState(0);
  const [cgtcBalance, setCgtcBalance] = useState(0);

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

  const getAllProposals = async () => {
    try {
      getAllProposalData({}).then(res => {
        console.log("Proposals: ", res);
        // setProposals(res);
      });
    } catch (e) {
      console.error(e);
    }
  };

  // getAllProposals();

  // sayHello();

  // Get balances of tokens used
  useEffect(() => {
    const getGtcBalance = () => {
      readContracts?.GTC?.balanceOf(address).then(result => {
        setGtcBalance(result.toString());
      });
    };

    getGtcBalance();
  }, [address]);

  useEffect(() => {
    const getCgtcBalance = () => {
      readContracts?.CGTC?.balanceOf(address).then(result => {
        setCgtcBalance(result.toString());
      });
    };

    getCgtcBalance();
  }, [address]);

  return (
    <div className="">
      <Row className="p-1">
        <Col className="p-1" span={12}>
          <Row>
            <Col span={8}>
              <span className="text-left text-5xl">Proposals</span>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <span className="text-left text-3xl">Stats</span>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <span className="text-left text-sm">This Round Total</span>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <span className="text-left text-xl">123,456 GTC</span>
              <span>(+13.6% from last round)</span>
            </Col>
          </Row>
        </Col>
        <Col className="p-1" span={12}>
          GTC Balance: {ethers.utils.formatEther(gtcBalance.toString())}
          <br />
          CGTC Balance: {ethers.utils.formatEther(cgtcBalance.toString())}
        </Col>
      </Row>
      <div className="p-2 h-screen border-2 border-purple-700 rounded bg-purple-700">
        <ProposalLane
          title={workstream[0]}
          proposals={proposals}
          workstream={workstream[0]}
          cgtcBalance={cgtcBalance}
          gtcBalance={gtcBalance}
        />
        <ProposalLane
          title={workstream[1]}
          proposals={proposals}
          workstream={workstream[1]}
          cgtcBalance={cgtcBalance}
          gtcBalance={gtcBalance}
        />
        <ProposalLane
          title={workstream[2]}
          proposals={proposals}
          workstream={workstream[2]}
          cgtcBalance={cgtcBalance}
          gtcBalance={gtcBalance}
        />
        <ProposalLane
          title={workstream[3]}
          proposals={proposals}
          workstream={workstream[3]}
          cgtcBalance={cgtcBalance}
          gtcBalance={gtcBalance}
        />
        <ProposalLane
          title={workstream[4]}
          proposals={proposals}
          workstream={workstream[4]}
          cgtcBalance={cgtcBalance}
          gtcBalance={gtcBalance}
        />
        <ProposalLane
          title={workstream[5]}
          proposals={proposals}
          workstream={workstream[5]}
          cgtcBalance={cgtcBalance}
          gtcBalance={gtcBalance}
        />
      </div>
    </div>
  );
};

export default Proposals;
