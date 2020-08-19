import React from "react";
import { connect } from "redux-bundler-react";
import { classnames } from "../utils";

export default connect(
  "doModalClose",
  "selectModalContent",
  "selectModalProps",
  "selectModalSize",
  ({ modalContent: ModalContent, doModalClose, modalProps, modalSize }) => {
    if (!ModalContent) return null;
    const modalCls = classnames({
      "modal-dialog": true,
      "modal-dialog-scrollable": true,
      "modal-dialog-centered": true,
      "modal-sm": modalSize === "sm",
      "modal-lg": modalSize === "lg",
      "modal-xl": modalSize === "xl",
    });
    return (
      <>
        <div
          onClick={doModalClose}
          className="modal fade show"
          style={{ display: "block", backgroundColor: "#ccc", opacity: 0.5 }}
        ></div>
        <div className="modal fade show" style={{ display: "block" }}>
          <div className={modalCls}>
            <ModalContent {...modalProps} />
          </div>
        </div>
      </>
    );
  }
);
