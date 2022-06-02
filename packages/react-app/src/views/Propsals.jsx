import { EditOutlined, EllipsisOutlined, SettingOutlined } from "@ant-design/icons";
import { Card, Col, Row } from "antd";
import React, { useState } from "react";

const { Meta } = Card;

const Proposals = () => {
  const status = ["posted", "amended", "readyToVoteSnapshot", "readyToVoteTally", "misc"];
  const [proposals, setProposals] = useState([
    {
      id: 1,
      title: "GR14 Round Structure",
      reviewedBy: [{ steward: "" }],
      posted: "",
      updated: "",
      version: "1",
      comments: [
        { comment: "", by: "" },
        { comment: "", by: "" },
      ],
      lastComment: { comment: "", by: "" },
      status: status[0],
    },
    {
      id: 2,
      title: "KERNEL Budget Request",
      reviewedBy: [{ steward: "" }],
      posted: "",
      updated: "",
      version: "1",
      comments: [
        { comment: "", by: "" },
        { comment: "", by: "" },
      ],
      lastComment: { comment: "", by: "" },
      status: status[0],
    },
  ]);

  return (
    <div>
      <Row className="p-1 align-middle h-screen">
        <Col className="p-1 m-1 border-2 text-left " span={5}>
          <span className="">Posted</span>
          <span className=""> ({proposals.status === "posted" ? 0 : proposals.length})</span>
          <div>
            {proposals.map((item, index) => {
              <Card
                title={proposals[index].title}
                type="inner"
                bordered={true}
                style={{}}
                actions={[
                  <SettingOutlined key="setting" />,
                  <EditOutlined key="edit" />,
                  <EllipsisOutlined key="ellipsis" />,
                ]}
              >
                {item.id}
                {/* <Meta
                  avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                  title={proposals[index].title}
                  description="This is the description"
                /> */}
              </Card>;
            })}
          </div>
        </Col>
        <Col className="p-1 m-1 border-2 text-left" span={5}>
          <span className="">Amended</span>
          <span className=""> ({proposals.status === "amended" ? 0 : 0})</span>
          <div></div>
        </Col>
        <Col className="p-1 m-1 border-2 text-left" span={5}>
          <span className="">Ready to Vote - Snapshot</span>
          <span className=""> ({proposals.status === "readyToVoteSnapshot" ? 0 : 0})</span>
          <div></div>
        </Col>
        <Col className="p-1 m-1 border-2 text-left" span={5}>
          <span className="">Ready to Vote - Tally</span>
          <span className=""> ({proposals.status === "readyToVoteTally" ? 0 : 0})</span>
          <div></div>
        </Col>
      </Row>
    </div>
  );
};

export default Proposals;
