import { CommentOutlined, FallOutlined, QuestionOutlined, RiseOutlined } from "@ant-design/icons";
import { Avatar, Card, Col, Divider, Progress, Row } from "antd";
import React, { useRef, useState } from "react";
import Draggable from "react-draggable";

const { Meta } = Card;

const ProposalLane = ({ title, proposals, workstream, cgtcBalance, gtcBalance }) => {
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });

  const draggleRef = useRef(null);

  const onStart = (_event, uiData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();

    if (!targetRect) {
      return;
    }

    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    });
  };

  return (
    <Row className="p-1 m-1 border-2 text-left bg-purple-500 rounded-xl">
      <Col span={24}>
        <span className="">{title}</span>
        <span className=""> ({proposals.workstream === workstream ? 0 : 0})</span>
        <Draggable onStart={() => onStart()}>
          <div className="w-4/12">
            {proposals.map((item, index) => {
              if (item.workstream === workstream) {
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
                    <Meta avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />} title={item.title} />
                    <div className="mt-3">
                      <Row>
                        <Col span={12}>
                          <span>by: {item.author}</span>
                          <br />
                        </Col>
                        <Col span={12} className="text-right">
                          <span className="p-2">{item.comments.length}</span>
                          <CommentOutlined
                            className="cursor-pointer"
                            onClick={() => {
                              console.log("Comments Clicked");
                            }}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col span={24}>
                          <span className="text-gray-500">Last Comment</span>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={24}>
                          {/* todo: make this a modal link that will show the last comment made */}
                          <span className="">{item.comments[item.comments.length - 1].by}</span>
                        </Col>
                      </Row>
                    </div>
                    <Divider>Options</Divider>
                    {proposals[index].options.map((item, index) => {
                      // console.log(item);
                      return (
                        <div key={index}>
                          <span>Option {item.id} </span>
                          <span className="text-right"> | CGTC {item.amount}</span>
                          <Progress
                            strokeColor={{
                              "0%": "#108ee9",
                              "100%": "#87d068",
                            }}
                            percent={item.convictionScore}
                            type="line"
                            size="small"
                            status="active"
                          />
                          <br />
                        </div>
                      );
                    })}
                  </Card>
                );
              } else {
                return <></>;
              }
            })}
          </div>
        </Draggable>
      </Col>
    </Row>
  );
};

export default ProposalLane;
