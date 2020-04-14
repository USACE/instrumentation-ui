import React from "react";
import { connect } from "redux-bundler-react";
import Modal from "./app-components/modal";

import "./css/App.scss";
import "./css/mdi/css/materialdesignicons.min.css";
import "./css/ms/css/mapskin.min.css";
import "./css/google-fonts/g.css";

export default connect("selectRoute", ({ route: Route }) => {
  return (
    <div>
      <Route />
      <Modal />
    </div>
  );
});
