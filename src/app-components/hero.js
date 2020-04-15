import React from "react";
import { connect } from "redux-bundler-react";
import Navbar from "./navbar";
import UploadButton from "./upload-button";

function App({ authIsLoggedIn }) {
  return (
    <div className="App">
      <section className="hero is-primary">
        <div className="hero-head">
          <Navbar theme="primary" hideBrand={true} />
        </div>
        <div className="hero-body">
          <div className="container has-text-centered">
            <h1 className="title">
              <i className="mdi mdi-water pr-2"></i>HHD Instrumentation Browser
            </h1>
            <h2 className="subtitle">Water data for Herbert Hoover Dike</h2>
            {authIsLoggedIn ? (
              <a href="/explore">
                <button className="button is-warning">Explore the data</button>
              </a>
            ) : null}
          </div>
        </div>
        <div className="hero-foot">
          <div className="container mb-2">
            <div className="level">
              <div className="level-left"></div>
              <div className="level-right">
                <div className="level-item">
                  {authIsLoggedIn ? <UploadButton /> : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default connect("selectAuthIsLoggedIn", App);
