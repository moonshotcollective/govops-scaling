import { FallOutlined, QuestionOutlined, RiseOutlined } from "@ant-design/icons";
import { Avatar, Card, Col, Row } from "antd";
import React from "react";

const { Meta } = Card;

const ProposalLane = ({ title, proposals, status }) => {
  return (
    <Row className="p-1 m-1 border-2 text-left bg-purple-500 rounded-xl">
      <Col span={24}>
        <span className="">{title}</span>
        <span className=""> ({proposals.status === status ? 0 : 0})</span>
        <div>
          {proposals.map((item, index) => {
            if (item.status === status) {
              return (
                <Card
                  key={item.id}
                  title={proposals[index].title}
                  type="inner"
                  bordered={true}
                  style={{}}
                  actions={[
                    <QuestionOutlined
                      key="setting"
                      onClick={() => {
                        console.log("Details clicked");
                        window.location = `/proposalDetail/${item.id}`;
                      }}
                    />,
                    <FallOutlined
                      key="edit"
                      onClick={() => {
                        console.log("Decrease clicked");
                      }}
                    />,
                    <RiseOutlined
                      key="ellipsis"
                      onClick={() => {
                        console.log("Increase clicked");
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
  );
};

export default ProposalLane;
