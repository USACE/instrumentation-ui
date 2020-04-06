import React, { useEffect } from "react";
import { connect } from "redux-bundler-react";

export default connect("doMapInitialize", ({ doMapInitialize, height }) => {
  let mapEl = null;

  useEffect(() => {
    doMapInitialize(mapEl);
  }, [doMapInitialize, mapEl]);

  return (
    <div
      style={{ height: height }}
      ref={el => {
        mapEl = el;
      }}
    />
  );
});
