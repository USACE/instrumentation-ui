import React from "react";
import { connect } from "redux-bundler-react";
// import ExplorerTimeSeriesPanel from "./explorer-time-series-panel";
import Chart from "../../app-components/chart/container";

export default connect(
  "selectExploreMapSelectedInstruments",
  "selectExploreMapInteractionsVersion",
  ({
    exploreMapSelectedInstruments: instruments,
    exploreMapInteractionsVersion,
  }) => {
    return (
      <Chart
        version={exploreMapInteractionsVersion}
        instruments={instruments}
      />
    );
  }
);
