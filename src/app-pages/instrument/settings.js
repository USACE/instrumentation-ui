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
    const alertsReady = process.env.REACT_APP_ALERT_EDITOR;
    const forumlaReady = process.env.REACT_APP_FORMULA_EDITOR;
    const chartReady = process.env.REACT_APP_INSTRUMENT_CHART;

    const tabs = [
      alertsReady && {
        title: 'Alerts',
        content: <AlertEditor />
      }, {
        title: 'Constants',
        content: <Constants />
      }, {
        title: 'Timeseries',
        content: <Timeseries data={measurements[instrument.id]} />,
      }, forumlaReady && {
        title: 'Formula Editor',
        content: <FormulaEditor />,
      }, chartReady && {
        title: 'Chart',
        content: <Chart />,
      }
    ].filter(e => e);

    return (
      <Card>
        <Tab.Container tabs={tabs} tabListClass='card-header pb-0' contentClass='card-body' />
      </Card>
    );
  }
);
