import React from "react";
import { connect } from "redux-bundler-react";

export default connect(
  "selectModalContent",
  "selectModalProps",
  ({ modalContent: ModalContent, modalProps: props }) => {
    if (!ModalContent) return null;
    return (
      <div className="modal is-active">
        <div className="modal-background"></div>
        <ModalContent {...props} />
      </div>
    );
  }
);
