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
    console.log('placeholder');
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
