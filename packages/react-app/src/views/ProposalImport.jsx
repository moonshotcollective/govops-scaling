import { Col, Row } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { getSinglePost } from "../helpers";

const server = "http://localhost:4001";

const ProposalImport = () => {
  const [proposal, setProposal] = useState({});
  const [post, setPost] = useState({});
  const [proposalId, setProposalId] = useState();

  // Calls to Discourse API for proposal import
  const importProposal = id => {
    try {
      getSinglePost(id).then(res => {
        console.log(res);
        setPost(res.data.data.post_stream.posts[0]);
        setProposal(res.data.data.post_stream.posts[0]);
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    importProposal(proposal.id);
  }, [proposal.id]);

  // Calls to database
  const createProposalNoOptions = async proposal => {
    try {
      console.log(proposal);
      const res = await axios.post(`${server}/api/proposal`, {
        id: proposal.id,
        topic_slug: proposal.topic_slug,
        raw: proposal.raw,
        latestActivity: [],
        // score: proposal.score,
        // staked: proposal.staked,
        options: [],
      });

      console.log(res);
      return res;
    } catch (error) {
      console.error(error);
    }
  };

  const saveProposalToDatabase = () => {
    createProposalNoOptions(proposal);
  };

  return (
    <div>
      <Row>
        <Col span={24} className="text-center text-4xl">
          Import Proposals
        </Col>
      </Row>
      <Row>
        <Col span={11} className="m-4">
          <div className="text-center text-2xl m-4">
            <span>Content</span>
          </div>
          <p className="border-2 bg-purple-200 text-black">{post.cooked}</p>
        </Col>
        <Col span={12} className="text-center">
          <div className="text-center text-2xl m-4">
            <span>Actions</span>
          </div>
          <Row className="mb-2">
            <Col span={24} className="ml-4 text-xl">
              <span className="mr-4 mb-2">Enter Id of Post to import:</span>
              <input
                className="text-black"
                type="text"
                id="post-id"
                onChange={e => {
                  setProposalId(e.target.value);
                }}
              />
            </Col>
          </Row>
          <Row className="mt-2">
            <Col span={24} className="ml-4 text-xl">
              <button
                className="bg-purple-600 p-4 w-96 hover:bg-purple-400"
                onClick={() => {
                  console.log("Importing proposal");
                  importProposal(proposalId);
                }}
              >
                Import
              </button>
            </Col>
          </Row>
          <Row className="mt-6">
            <Col span={24} className="ml-4 text-xl">
              <span>Save to the database</span>
              <br />
              <button
                className="bg-purple-600 p-4 w-96 hover:bg-purple-400 m-4"
                onClick={() => {
                  console.log("Saving...");
                  saveProposalToDatabase();
                }}
              >
                Save
              </button>
              <hr className="p-4 m-4" />
              <label>Username: </label>
              <span>{post.username}</span>
              <br />
              <label>Created At: </label>
              <span>{post.created_at}</span>
              <br />
              <label>Last Updated: </label>
              <span>{post.updated_at}</span>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default ProposalImport;
