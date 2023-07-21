import React from 'react';
import { connect } from 'redux-bundler-react';

import AlertEditor from './alert/alert-editor';
import Card from '../../app-components/card';
import Chart from './chart/chart';
import Constants from './constants/constants';
import FormulaEditor from './formula/formula';
import TabContainer from '../../app-components/tab';
import Timeseries from './timeseries/timeseries';

export default connect(
  'selectTimeseriesMeasurementsItemsObject',
  'selectInstrumentsByRoute',
  ({
    timeseriesMeasurementsItemsObject: measurements,
    instrumentsByRoute: instrument,
  }) => {
    // const alertsReady = import.meta.env.VITE_ALERT_EDITOR === 'true';
    const alertsReady = false;
    const forumlaReady = import.meta.env.VITE_FORMULA_EDITOR === 'true';
    const chartReady = import.meta.env.VITE_INSTRUMENT_CHART === 'true';

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
        <TabContainer tabs={tabs} tabListClass='card-header pb-0' contentClass='card-body' />
      </Card>
    );
  }
);
