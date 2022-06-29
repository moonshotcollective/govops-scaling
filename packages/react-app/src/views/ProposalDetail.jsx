import { Col, notification, Row } from "antd";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { ConvictionModal, OptionModal, ProposalOptions } from "../components";

const ProposalDetail = ({ readContracts, writeContracts, address, tx, ...props }) => {
  const [amount, setAmount] = useState(0);
  const [isGaugeExecutable, setIsGaugeExecutable] = useState(false);
  const [gaugeDetails, setGaugeDetails] = useState({});
  const [totalStakedForProposal, setTotalStakedForProposal] = useState(0);
  const [proposalId, setProposalId] = useState();
  const [cgtcBalance, setCgtcBalance] = useState(0);
  const [gtcBalance, setGtcBalance] = useState(0);
  const [convictionLoading, setConvictionLoading] = useState(false);
  const [allowance, setAllowance] = useState(0);
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [isSteward, setIsSteward] = useState(false);

  // modal state vars
  const [showConvictionModal, setShowConvictionModal] = useState(false);
  const [showOptionModal, setShowOptionModal] = useState(false);

  const showCModal = () => {
    setShowConvictionModal(true);
  };

  const showOModal = () => {
    setShowOptionModal(true);
  };

  const handleCancel = () => {
    setShowConvictionModal(false);
    setShowOptionModal(false);
  };

  // let's get the id that was passed for the proposal
  let { id } = useParams();
  let history = useHistory();

  // set the proposal id into state var on page load
  useEffect(() => {
    setProposalId(id);
    console.log("proposal id from url", id);
  }, [id]);

  useEffect(() => {
    getApprovedAmount();
  }, [address]);

  // database functions
  const submitOption = () => {};

  // Some read functions for onchain data
  const getApprovedAmount = async () => {
    await readContracts?.CGTC?.allowance(address, readContracts?.ConvictionVoting?.address).then(result => {
      console.log("Allowance: ", result.toString());
      setAllowance(result.toString());
    });
  };

  const getCgtcBalance = () => {
    readContracts?.CGTC?.balanceOf(address).then(result => {
      setCgtcBalance(result);
    });
  };

  // write functions for onchain
  const approveCgtc = async () => {
    setLoadingApprove(true);
    await tx(writeContracts?.CGTC?.approve(readContracts?.ConvictionVoting?.address, ethers.utils.parseEther(amount)));
    getApprovedAmount();
    getCgtcBalance();
    setLoadingApprove(false);
  };

  // todo: add function to check wether stake or unstake
  const submitConviction = async (action, option) => {
    if (action === true) {
      // true is 'stake'
      await addConviction();
      getApprovedAmount();
      getCgtcBalance();
    } else if (action === false) {
      // false is 'unstake'
      await removeAllConvictions();
      getApprovedAmount();
      getCgtcBalance();
    }
  };

  // Adding conviction to a propsal
  const addConviction = async () => {
    setConvictionLoading(true);
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
        setConvictionLoading(false);
        setShowConvictionModal(false);
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

  //! dummy proposals
  const proposals = [
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
        { comment: "", by: "" },
        { comment: "", by: "" },
      ],
      lastComment: { comment: "This is awesome", by: "jaxcoder" },
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
      reviewedBy: [{ steward: "" }],
      posted: "3d ago",
      updated: "",
      version: "1",
      amended: false,
      comments: [
        { comment: "", by: "" },
        { comment: "", by: "" },
      ],
      lastComment: { comment: "Leeeeettttt's Goooo", by: "gtchase" },
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
        { comment: "", by: "" },
        { comment: "", by: "" },
      ],
      lastComment: { comment: "Leeeeettttt's Goooo", by: "gtchase" },
      options: [
        { id: "A", amount: 123456, convictionScore: 38 },
        { id: "B", amount: 8765457, convictionScore: 52 },
        { id: "C", amount: 290634, convictionScore: 79 },
        { id: "D", amount: 146794, convictionScore: 85 },
      ],
      contentRaw: "",
    },
  ];

  // todo: database functions for proposal options
  const addOption = () => {};

  const editOption = () => {};

  const deleteOption = () => {};

  // Get balances of tokens used
  useEffect(() => {
    const getGtcBalance = () => {
      readContracts?.GTC?.balanceOf(address).then(result => {
        setGtcBalance(result.toString());
        console.log(result);
      });
    };

    getGtcBalance();
  }, [address, readContracts?.GTC]);

  useEffect(() => {
    const getCgtcBalance = () => {
      readContracts?.CGTC?.balanceOf(address).then(result => {
        setCgtcBalance(result.toString());
        console.log(result);
      });
    };

    getCgtcBalance();
  }, [address, readContracts?.CGTC]);

  return (
    <div>
      <Row id="header">
        <Col span={8} className="">
          <button
            className="text-left p-3 m-3 bg-purple-600 hover:bg-purple-400"
            onClick={() => {
              history.goBack();
            }}
          >
            Back
          </button>
        </Col>
        <Col span={8} className="text-center">
          <span className="mt-3 text-4xl">Proposal {id}</span>
        </Col>
        <Col span={8}>
          <span></span>
        </Col>
      </Row>
      <Row id="main">
        {/* Left side */}
        <Col span={12}>
          <Row className="mt-5">
            <Col span={24} className="text-4xl mt-4 ml-4">
              {proposals[id - 1].title}
            </Col>
          </Row>
          <Row className="mt-4 ml-5">
            <Col span={7}>
              <span>{proposals[id - 1].author}</span>
            </Col>
            <Col span={8} className="mr-8">
              <span>Posted {proposals[id - 1].posted}</span>
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
              {isSteward ? (
                <button className="w-full p-3 bg-purple-600 hover:bg-purple-400" onClick={() => showOModal()}>
                  Add Option
                </button>
              ) : (
                <button className="w-full p-3 bg-purple-600 hover:bg-purple-400" onClick={() => showCModal()}>
                  Submit Your Conviction
                </button>
              )}
            </Col>
          </Row>
          <Row>
            <Col span={24} className="mt-11 ml-2">
              <span>Conviction</span>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <ProposalOptions options={proposals[id - 1].options} />
            </Col>
          </Row>
        </Col>
      </Row>
      {/* Modal for staking/unstaking conviction */}
      <ConvictionModal
        isVisible={showConvictionModal}
        handleCancel={handleCancel}
        proposal={proposals[id - 1]}
        cgtcBalance={cgtcBalance}
        submitOption={submitConviction}
        allowance={allowance}
      />
      <OptionModal
        isVisible={showOptionModal}
        handleCancel={handleCancel}
        proposal={proposals[id - 1]}
        cgtcBalance={cgtcBalance}
        submitOption={submitOption}
        allowance={allowance}
      />
    </div>
  );
};

export default ProposalDetail;
