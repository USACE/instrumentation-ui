import React from "react";
import Navbar from "../../app-components/navbar";
import Map from "../../app-components/map";
// import MapTools from "./map-tools";
import TimeSeries from "../../app-components/timeSeries";
import PanelGroup from "react-panelgroup";

export default () => {
  return (
    <div>
      <Navbar theme="primary" />
      <PanelGroup>
        <Map height={window.innerHeight - 49} />
        <div className="container mx-3">
          <TimeSeries title={"Time Series Data"} x={null} y={null} />
        </div>
      </PanelGroup>
    </div>
  );
};
