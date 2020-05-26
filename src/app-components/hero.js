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
              <i className="mdi mdi-pulse pr-2"></i>Instrumentation Browser
            </h1>
            <h2 className="subtitle">Tools for visulizing water data</h2>
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

// took the upload button out, but if you want to add buttons on the hero this is the footer
// <div className="hero-foot">
// <div className="container mb-2">
// <div className="level">
//   <div className="level-left"></div>
//   <div className="level-right">
//     <div className="level-item">
//       {authIsLoggedIn ? <UploadButton /> : null}
//     </div>
//   </div>
// </div>
// </div>
// </div>
