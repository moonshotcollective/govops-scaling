import { UploadOutlined } from "@ant-design/icons";
import { Modal, notification } from "antd";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";

const CGTCClaimModal = ({ isVisible, handleCancel, cgtcBalance, address, readContracts, writeContracts, tx }) => {
  const [gtcBalance, setGtcBalance] = useState(0);
  const [delegatedGtcBalance, setDelegatedGtcBalance] = useState(0);
  const [isClaimLoading, setIsClaimLoading] = useState(false);

  const claimTokens = async () => {
    setIsClaimLoading(true);
    tx(writeContracts?.CGTC?.claimTokensForCaller(), async update => {
      if (update && (update.status === "confirmed" || UploadOutlined.status === 1)) {
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
          message: "You have claimed your CGTC 💃",
        });
        setIsClaimLoading(false);
      }
    });
  };

  // Loads up the balance of GTC in wallet
  // todo: get delegated balance and any LP token
  useEffect(() => {
    const getGtcBalance = () => {
      readContracts?.GTC?.balanceOf(address).then(result => {
        setGtcBalance(result.toString());
        console.log(result);
      });
    };

    const getDelegatedGtcBalance = () => {
      // readContracts?.GTC?.delegates(address).then(result => {
      //   console.log(result.toString());
      //   setDelegatedGtcBalance(result.toString());
      // });
    };

    getGtcBalance();
    getDelegatedGtcBalance();
  }, [address, readContracts?.GTC]);

  return (
    <Modal
      title="Claim CGTC"
      visible={isVisible}
      onCancel={handleCancel}
      okText={"Claim"}
      okButtonProps={{
        style: { width: "400px" },
        loading: isClaimLoading,
      }}
      onOk={() => {
        console.log("Claim");
        claimTokens();
      }}
    >
      <div>
        <div id="subtitle" className="text-center">
          Unstake all of your convictions
        </div>
        <div id="subtitle" className="text-center">
          Your GTC Balance: {ethers.utils.formatEther(gtcBalance.toString())}
        </div>
        <div id="subtitle" className="text-center">
          Your Delegated GTC Balance: {ethers.utils.formatEther(delegatedGtcBalance.toString())}
        </div>
        <div id="subtitle" className="text-center">
          Your CGTC Balance: {ethers.utils.formatEther(cgtcBalance.toString())}
        </div>
      </div>
    </Modal>
  );
};

export default CGTCClaimModal;
