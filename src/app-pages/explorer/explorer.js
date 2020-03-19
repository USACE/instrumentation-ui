import React from "react";
import Navbar from "../../app-components/navbar";
import Map from "./map";

export default () => {
  return (
    <div>
      <Navbar theme="primary" />
      <div className="columns">
        <div className="column is-7">
          <Map height={window.innerHeight - 49} />
        </div>
        <div className="column">
          <a href="/instrument/2323">
            <button className="button is-secondary">
              Open an instrument with id of 2323
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};
