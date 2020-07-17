import React from "react";
import { connect } from "redux-bundler-react";
import Navbar from "./navbar";
// import UploadButton from "./upload-button";

import bg1 from "../img/bg-1.jpg";

function App({ authIsLoggedIn }) {
  return (
    <div className="App">
      <section
        className="hero is-primary"
        style={{
          backgroundImage: `url(${bg1})`,
          backgroundSize: "cover",
          backgroundPosition: "top",
        }}
      >
        <div className="hero-head">
          <Navbar theme="primary" hideBrand={true} />
        </div>
        <div className="hero-body">
          <div className="container has-text-centered">
            <h1 className="title">
              <a className="has-text-white" href="/">
                <i className="mdi mdi-pulse pr-2"></i>MIDAS
              </a>
            </h1>

            <h2 className="subtitle">
              Monitoring Instrumentation Data Acquisition System
            </h2>

            <a href="/explore">
              <button className="is-hidden button is-warning">
                Explore the data
              </button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default connect("selectAuthIsLoggedIn", App);
