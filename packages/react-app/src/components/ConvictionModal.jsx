import { Modal } from "antd";
import React from "react";

const ConvictionModal = ({ isVisible, handleOk, handleCancel }) => {
  return <Modal title="Conviction Modal" visible={isVisible} onCancel={handleCancel} onOk={handleOk}></Modal>;
};

export default ConvictionModal;
