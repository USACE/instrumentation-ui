import React from "react";
import { connect } from "redux-bundler-react";
import Modal from "./app-components/modal";

import "./css/bootstrap/css/bootstrap.water.min.css";
import "./css/mdi/css/materialdesignicons.min.css";
import "./css/ms/css/mapskin.min.css";
import "./css/index.css";

export default connect('selectRoute', ({ route: Route }) => {
  return (
    <div>
      <Route />
      <Modal />
    </div>
  );
});
