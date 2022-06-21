import { Button, Col, Modal, notification, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ProposalOptions, ConvictionModal } from "../components";

const ProposalDetail = ({ readContracts, writeContracts, address, tx, ...props }) => {
  const [amount, setAmount] = useState(0);
  const [isGaugeExecutable, setIsGaugeExecutable] = useState(false);
  const [gaugeDetails, setGaugeDetails] = useState({});
  const [totalStakedForProposal, setTotalStakedForProposal] = useState(0);
  const [proposalId, setProposalId] = useState();

  // conviction modal state vars
  const [showConvictionModal, setShowConvictionModal] = useState(false);

  const showCModal = () => {
    setShowConvictionModal(true);
  };

  const handleOk = () => {
    setShowConvictionModal(false);
  };

  const handleCancel = () => {
    setShowConvictionModal(false);
  };

  // let's get the id that was passed for the proposal
  let { id } = useParams();

  // set the proposal id into state var on page load
  useEffect(() => {
    setProposalId(id);
    console.log("proposal id from url", id);
  }, [id]);

  // Adding conviction to a propsal
  const addConviction = async () => {
    await tx(writeContracts?.ConvictionVoting?.addConviction(address, proposalId, amount), async update => {
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
        proposalId, // proposalId
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

  // On-chain functions
  const checkIsGaugeExecutable = id => {
    readContracts?.ConvictionVoting?.isGaugeExecutable(id).then(response => {
      console.log(response);
      setIsGaugeExecutable(response);
    });
  };
  // checkIsGaugeExecutable(1);

  //

  return (
    <div>
      <Row>
        <Col span={8} className="">
          <Button className="text-left p-1 m-1">Back</Button>
        </Col>
        <Col span={8} className="text-center">
          <span className="m-1 p-1 text-4xl">Proposal {id}</span>
        </Col>
        <Col span={8}>
          <span></span>
        </Col>
      </Row>
      <Row>
        {/* Left side */}
        <Col span={12}>
          <Row className="mt-5">
            <Col span={24} className="text-4xl mt-4 ml-4">
              Title content
            </Col>
          </Row>
          <Row className="mt-4 ml-5">
            <Col span={8}>
              <span>by annikalewis</span>
            </Col>
            <Col span={8}>
              <span>Posted Jun 6, 2022 | 15d</span>
            </Col>
            <Col span={8}>
              <a href="https://gov.gitcoin.co/">View on Forum</a>
            </Col>
          </Row>
          <Row className="mt-11">
            <Col span={23} className="m-4">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                deserunt mollit anim id est laborum.
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                deserunt mollit anim id est laborum.
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                deserunt mollit anim id est laborum.
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                deserunt mollit anim id est laborum.
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                deserunt mollit anim id est laborum.
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                deserunt mollit anim id est laborum.
              </p>
            </Col>
          </Row>
        </Col>
        {/* Right side */}
        <Col span={12}>
          <Row>
            <Col span={23} className="mt-11 mr-4 pr-4">
              <Button className="w-full" onClick={() => showCModal()}>
                Submit Your Conviction
              </Button>
            </Col>
          </Row>
          <Row>
            <Col span={24} className="mt-11 ml-2">
              <span>Conviction</span>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <ProposalOptions option={"A"} />
            </Col>
          </Row>
        </Col>
      </Row>
      {/* Modal for staking/unstaking conviction */}
      <ConvictionModal isVisible={showConvictionModal} handleOk={handleOk} handleCancel={handleCancel} />
    </div>
  );
};



export default ProposalDetail;
