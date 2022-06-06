import { EditOutlined, EllipsisOutlined, SettingOutlined } from "@ant-design/icons";
import { Avatar, Card, Col, Row } from "antd";
import React, { useState } from "react";
import { getSinglePost } from "../helpers";

const { Meta } = Card;

const Proposals = () => {
  const status = ["posted", "review", "amended", "readyToVoteSnapshot", "readyToVoteTally", "misc"];
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

  // testing Discourse api calls to the console
  getSinglePost(10567).then(result => {
    console.log("test", result);
  });

  return (
    <div>
      <Row className="p-1 align-middle h-screen">
        <Col className="p-1 m-1 border-2 text-left " span={4}>
          <span className="">Posted</span>
          <span className=""> ({proposals.status === "posted" ? 0 : 1})</span>
          <div>
            {proposals.map((item, index) => {
              if (item.status === "posted") {
                return (
                  <Card
                    title={proposals[index].title}
                    type="inner"
                    bordered={true}
                    style={{}}
                    actions={[
                      <SettingOutlined
                        key="setting"
                        onClick={() => {
                          console.log("Settings clicked");
                        }}
                      />,
                      <EditOutlined
                        key="edit"
                        onClick={() => {
                          console.log("Edit clicked");
                        }}
                      />,
                      <EllipsisOutlined
                        key="ellipsis"
                        onClick={() => {
                          console.log("Elipses clicked");
                        }}
                      />,
                    ]}
                  >
                    <Meta
                      avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                      title={item.title}
                      description="description"
                    />
                    {/* Add score here */}
                    Reviewed By: {item.reviewedBy.length + "/5 stewards"}
                    <br />
                    Posted: {item.posted}
                    <br />
                    Version: {item.version}
                    <br />
                    {item.comments.length} comments
                    <br />
                    Last comment: {item.lastComment.by}
                  </Card>
                );
              }
            })}
          </div>
        </Col>
        <Col className="p-1 m-1 border-2 text-left" span={4}>
          <span className="">In Review</span>
          <span className=""> ({proposals.status === "review" ? 0 : 0})</span>
          <div>
            {proposals.map((item, index) => {
              if (item.status === "review") {
                return (
                  <Card
                    title={proposals[index].title}
                    type="inner"
                    bordered={true}
                    style={{}}
                    actions={[
                      <SettingOutlined
                        key="setting"
                        onClick={() => {
                          console.log("Settings clicked");
                        }}
                      />,
                      <EditOutlined
                        key="edit"
                        onClick={() => {
                          console.log("Edit clicked");
                        }}
                      />,
                      <EllipsisOutlined
                        key="ellipsis"
                        onClick={() => {
                          console.log("Elipses clicked");
                        }}
                      />,
                    ]}
                  >
                    <Meta
                      avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                      title={item.title}
                      description="description"
                    />
                    {/* Add score here */}
                    Reviewed By: {item.reviewedBy.length + "/5 stewards"}
                    <br />
                    Posted: {item.posted}
                    <br />
                    Version: {item.version}
                    <br />
                    {item.comments.length} comments
                    <br />
                    Last comment: {item.lastComment.by}
                  </Card>
                );
              }
            })}
          </div>
        </Col>
        <Col className="p-1 m-1 border-2 text-left" span={4}>
          <span className="">Amended</span>
          <span className=""> ({proposals.status === "amended" ? 0 : 0})</span>
          <div>
            {proposals.map((item, index) => {
              if (item.status === "amended") {
                return (
                  <Card
                    title={proposals[index].title}
                    type="inner"
                    bordered={true}
                    style={{}}
                    actions={[
                      <SettingOutlined
                        key="setting"
                        onClick={() => {
                          console.log("Settings clicked");
                        }}
                      />,
                      <EditOutlined
                        key="edit"
                        onClick={() => {
                          console.log("Edit clicked");
                        }}
                      />,
                      <EllipsisOutlined
                        key="ellipsis"
                        onClick={() => {
                          console.log("Elipses clicked");
                        }}
                      />,
                    ]}
                  >
                    <Meta
                      avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                      title={item.title}
                      description="description"
                    />
                    {/* Add score here */}
                    Reviewed By: {item.reviewedBy.length + "/5 stewards"}
                    <br />
                    Posted: {item.posted}
                    <br />
                    Version: {item.version}
                    <br />
                    {item.comments.length} comments
                    <br />
                    Last comment: {item.lastComment.by}
                  </Card>
                );
              }
            })}
          </div>
        </Col>
        <Col className="p-1 m-1 border-2 text-left" span={4}>
          <span className="">Ready to Vote - Snapshot</span>
          <span className=""> ({proposals.status === "readyToVoteSnapshot" ? 0 : 0})</span>
          <div>
            {proposals.map((item, index) => {
              if (item.status === "readyToVoteSnapshot") {
                return (
                  <Card
                    title={proposals[index].title}
                    type="inner"
                    bordered={true}
                    style={{}}
                    actions={[
                      <SettingOutlined
                        key="setting"
                        onClick={() => {
                          console.log("Settings clicked");
                        }}
                      />,
                      <EditOutlined
                        key="edit"
                        onClick={() => {
                          console.log("Edit clicked");
                        }}
                      />,
                      <EllipsisOutlined
                        key="ellipsis"
                        onClick={() => {
                          console.log("Elipses clicked");
                        }}
                      />,
                    ]}
                  >
                    <Meta
                      avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                      title={item.title}
                      description="description"
                    />
                    {/* Add score here */}
                    Reviewed By: {item.reviewedBy.length + "/5 stewards"}
                    <br />
                    Posted: {item.posted}
                    <br />
                    Version: {item.version}
                    <br />
                    {item.comments.length} comments
                    <br />
                    Last comment: {item.lastComment.by}
                  </Card>
                );
              }
            })}
          </div>
        </Col>
        <Col className="p-1 m-1 border-2 text-left" span={4}>
          <span className="">Ready to Vote - Tally</span>
          <span className=""> ({proposals.status === "readyToVoteTally" ? 0 : 0})</span>
          <div>
            {proposals.map((item, index) => {
              if (item.status === "readyToVoteTally") {
                return (
                  <Card
                    title={proposals[index].title}
                    type="inner"
                    bordered={true}
                    style={{}}
                    actions={[
                      <SettingOutlined
                        key="setting"
                        onClick={() => {
                          console.log("Settings clicked");
                        }}
                      />,
                      <EditOutlined
                        key="edit"
                        onClick={() => {
                          console.log("Edit clicked");
                        }}
                      />,
                      <EllipsisOutlined
                        key="ellipsis"
                        onClick={() => {
                          console.log("Elipses clicked");
                        }}
                      />,
                    ]}
                  >
                    <Meta
                      avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                      title={item.title}
                      description="description"
                    />
                    {/* Add score here */}
                    Reviewed By: {item.reviewedBy.length + "/5 stewards"}
                    <br />
                    Posted: {item.posted}
                    <br />
                    Version: {item.version}
                    <br />
                    {item.comments.length} comments
                    <br />
                    Last comment: {item.lastComment.by}
                  </Card>
                );
              }
            })}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Proposals;
