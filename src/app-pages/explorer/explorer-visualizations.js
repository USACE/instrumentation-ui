import React from "react";
import { connect } from "redux-bundler-react";
import ExplorerTimeSeriesPanel from "./explorer-time-series-panel";

export default connect(
  "selectExploreMapSelectedInstruments",
  "selectExploreMapInteractionsVersion",
  ({
    exploreMapSelectedInstruments: instruments,
    exploreMapInteractionsVersion,
  }) => {
    return (
      <div className="mx-3">
        <ExplorerTimeSeriesPanel
          version={exploreMapInteractionsVersion}
          instruments={instruments}
        />
      </div>
    );
  }
);
