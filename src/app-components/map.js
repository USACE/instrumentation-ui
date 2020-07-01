import React, { useEffect } from "react";
import { connect } from "redux-bundler-react";

export default connect(
  "doMapInitialize",
  ({ doMapInitialize, height, layers }) => {
    let mapEl = null;

    const opts = {
      layers: layers,
    };

    useEffect(() => {
      doMapInitialize(mapEl, opts);
    }, [doMapInitialize, mapEl, opts]);

    return (
      <div
        style={{ position: "absolute", top: 0, right: 0, left: 0, bottom: 0 }}
        ref={(el) => {
          mapEl = el;
        }}
      />
    );
  }
);
