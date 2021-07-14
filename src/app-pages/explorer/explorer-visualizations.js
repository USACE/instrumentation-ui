import React from 'react';
import { connect } from 'redux-bundler-react';

import ChartContainer from '../../app-components/chart/container';

export default connect(
  'selectExploreMapSelectedInstruments',
  'selectExploreMapInteractionsVersion',
  ({
    exploreMapSelectedInstruments: instruments,
    exploreMapInteractionsVersion,
  }) => (
    <ChartContainer
      version={exploreMapInteractionsVersion}
      instruments={instruments}
    />
  )
);
