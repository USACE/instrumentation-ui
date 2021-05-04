import React from 'react';
import { connect } from 'redux-bundler-react';
import Chart from '../../app-components/chart/container';

export default connect(
  'selectExploreMapSelectedInstruments',
  'selectExploreMapInteractionsVersion',
  ({
    exploreMapSelectedInstruments: instruments,
    exploreMapInteractionsVersion,
  }) => {
    return (
      <div>
        <Chart
          version={exploreMapInteractionsVersion}
          instruments={instruments}
        />
      </div>
    );
  }
);
