import { EditOutlined, EllipsisOutlined, SettingOutlined } from "@ant-design/icons";
import { Avatar, Card, Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import { getLatestPosts, getSinglePost } from "../helpers";

const server = "http://localhost:4001/api/";

const { Meta } = Card;

const Proposals = ({ address }) => {
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

  useEffect(() => {
    getLatestPosts().then(result => {
      console.log("test response: ", result.data.data);
      setLatestPosts(result.data.data);
    });
  }, [address]);

  const getPost = id => {
    getSinglePost(id).then(res => {
      setCurrentPost(res.data.data);
    });
  };

  // Auth errors...
  // getPost();

  return (
    <div>
      <Row className="p-1">
        <Col className="p-1 m-1 border-2" span={11}>
          <Row>
            <Col span={8}>
              <span className="text-left text-6xl">Proposals</span>
            </Col>
            <Col span={8}></Col>
            <Col span={8}></Col>
          </Row>
          <Row>
            <Col span={8}></Col>
            <Col span={8}></Col>
            <Col span={8}></Col>
          </Row>
        </Col>
        <Col className="p-1 m-1 border-2" span={11}>
          sorting/filters
        </Col>
      </Row>
      <Row className="p-2 align-middle h-screen">
        <Col className="p-1 m-1 border-2 text-left" span={4}>
          <span className="">Posted</span>
          <span className=""> ({proposals.status === "posted" ? 0 : 1})</span>
          <div>
            {proposals.map((item, index) => {
              if (item.status === "posted") {
                return (
                  <Card
                    key={item.id}
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
              } else {
                return <></>;
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
              } else {
                return <></>;
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
              } else {
                return <></>;
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
              } else {
                return <></>;
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
              } else {
                return <></>;
              }
            })}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Proposals;
