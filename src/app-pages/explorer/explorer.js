import React, { useState, useEffect } from "react";
import { connect } from "redux-bundler-react";
import debounce from "lodash.debounce";
import Panel from "./panel";
import Navbar from "../../app-components/navbar";
import Map from "../../app-components/classMap";
import MapTools from "./map-tools";
import Visualizations from "./explorer-visualizations";
import PanelGroup from "react-panelgroup";

export default connect(
  "selectMapsObject",
  "selectExploreMapKey",
  ({ mapsObject: maps, exploreMapKey: mapKey }) => {
    const map = maps[mapKey];
    const [landscapeMode, setLandscapeMode] = useState(false);

    useEffect(() => {
      function toggleLandscape(e) {
        if (e.keyCode === 86 && e.shiftKey) {
          setLandscapeMode(!landscapeMode);
        }
      }
      window.addEventListener("keydown", toggleLandscape);
      return () => {
        window.removeEventListener("keydown", toggleLandscape);
      };
    });

    const updateMapSize = debounce(() => {
      if (map) map.updateSize();
    }, 200);

    return (
      <div>
        <Navbar theme="primary" />
        <div
          style={{
            position: "absolute",
            top: 61,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <PanelGroup
            borderColor="#ccc"
            spacing={2}
            onUpdate={() => {
              updateMapSize();
            }}
            direction={landscapeMode ? "column" : "row"}
          >
            <Panel>
              <Map
                mapKey={mapKey}
                options={{ center: [-80.8027, 26.9419], zoom: 10 }}
              />
              <MapTools />
            </Panel>
            <Panel>
              <Visualizations />
            </Panel>
          </PanelGroup>
        </div>
      </div>
    );
  }
);
