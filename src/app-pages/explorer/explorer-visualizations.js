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
    // placeholder for parameters?
    const array = [1, 2, 3, 4];
    return (
      <div>
        {/* {array.map((x) => (
          <div>
            <h1>{x}</h1> */}
        <Chart
          version={exploreMapInteractionsVersion}
          instruments={instruments}
        />
        {/* </div>
        ))} */}
      </div>
    );
  }
);
