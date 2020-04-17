import React from "react";
import Navbar from "../../app-components/navbar";
import Map from "../../app-components/map";
import MapTools from "./map-tools";
import TimeSeries from "../../app-components/timeSeries";

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
            <TimeSeries title={"Time Series Data"} x={null} y={null} />
          </div>
        </div>
      </div>
    </div>
  );
};
