import React from "react";
import Navbar from "../../app-components/navbar";
import Map from "./map";
import MapTools from "./map-tools";
import Chart from "../../app-components/chart";

export default () => {
  return (
    <div>
      <Navbar theme="primary" />
      <div className="columns">
        <div className="column is-7">
          <Map height={window.innerHeight - 49} />
          <div style={{ position: "absolute", top: "60px", left: "20px" }}>
            <MapTools />
          </div>
        </div>
        <div className="column">
          <div className="container mx-3">
            <a href="/instrument/2323">
              <button className="button is-secondary">
                Open an instrument with id of 2323
              </button>
            </a>
            <Chart />
          </div>
        </div>
      </div>
    </div>
  );
};
