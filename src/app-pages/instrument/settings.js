import React from 'react';
import { connect } from 'redux-bundler-react';

import AlertEditor from './alert/alert-editor';
import Card from '../../app-components/card';
import Chart from './chart/chart';
import Constants from './constants/constants';
import FormulaEditor from './formula/formula';
import Tab from '../../app-components/tab';
import Timeseries from './timeseries/timeseries';

export default connect(
  'selectTimeseriesMeasurementsItemsObject',
  'selectInstrumentsByRoute',
  ({
    timeseriesMeasurementsItemsObject: measurements,
    instrumentsByRoute: instrument,
  }) => {
    const tabs = [{
      title: 'Alerts',
      content: <AlertEditor />
    }, {
      title: 'Constants',
      content: <Constants />
    }, {
      title: 'Timeseries',
      content: <Timeseries data={measurements[instrument.id]} />,
    }, {
      title: 'Formula Editor',
      content: <FormulaEditor />,
    }, {
      title: 'Chart',
      content: <Chart />,
    }];

    return (
      <Card>
        <Tab.Container tabs={tabs} tabListClass='card-header pb-0' contentClass='card-body' />
      </Card>
    );
  }
);
