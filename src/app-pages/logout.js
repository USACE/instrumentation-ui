import React, { useEffect } from "react";
import { connect } from "redux-bundler-react";

export default connect("doAuthLogout", ({ doAuthLogout }) => {
  useEffect(() => {
    doAuthLogout();
  });
  return <p>Logging out</p>;
});
