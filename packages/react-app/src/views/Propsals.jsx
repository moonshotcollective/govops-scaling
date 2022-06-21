import { Card, Col, Row } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { ProposalLane } from "../components";
import { getSinglePost, sayHello } from "../helpers";

const server = "http://localhost:4001/api/";

//! Developer notes: a gaugeId will equal the proposalId, they are the same.
const Proposals = ({ address, readContracts, writeContracts, tx }) => {
  const status = ["posted", "review", "amended", "readyToVoteSnapshot", "readyToVoteTally", "misc"];

  const [latestPosts, setLatestPosts] = useState();
  const [currentPost, setCurrentPost] = useState();
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
      <div className="p-2 h-screen border-2 border-purple-700 rounded bg-purple-700">
        <ProposalLane title="Posted" proposals={proposals} status="posted" />
        <ProposalLane title="In Review" proposals={proposals} status="review" />
        <ProposalLane title="Amended" proposals={proposals} status="amended" />
        <ProposalLane title="Ready To Vote Snapshot" proposals={proposals} status="readyToVoteSnapshot" />
        <ProposalLane title="Ready To Vote Tally" proposals={proposals} status="readyToVoteTally" />
      </div>
    </div>
  );
};

export default Proposals;
