import { EditOutlined, EllipsisOutlined, SettingOutlined } from "@ant-design/icons";
import { Avatar, Card, Col } from "antd";
import React from "react";

const { Meta } = Card;

const ProposalLane = ({ title, proposals, status }) => {
  return (
    <Col className="p-1 m-1 border-2 text-left bg-purple-500 rounded-xl" span={4}>
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
  );
};

export default ProposalLane;
