import React, { useEffect, useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import { connect } from 'redux-bundler-react';
import { subDays } from 'date-fns';
import { DateTime } from 'luxon';

import Chart from '../../../../../app-components/chart/chart';
import TabContainer from '../../../../../app-components/tab/tabContainer';
import { ModalContent, ModalBody, ModalFooter, ModalHeader } from '../../../../../app-components/modal';

const defaultTrace = (name, color) => ({
  x: [],
  y: [],
  hovertemplate: [],
  name,
  type: 'bar',
  marker: { color },
});

const generateDataTraces = (data = []) => {
  if (!data.length) return [];

  return data.reduce((accum, current, index) => {
    const {
      expected_total_submittals,
      green_submittals,
      month,
      red_submittals,
      yellow_submittals,
      // project_id, @TODO - use to filter by own project
    } = current;

    const monthDT = DateTime.fromISO(month);

    const displayString = (index) => {
      if (index === 0 || monthDT.month === 1) {
        return `${monthDT.monthLong} ${monthDT.year}`;
      }

      return monthDT.monthLong;
    };

    return {
      ...accum,
      green: {
        ...accum.green,
        x: [...accum.green.x, displayString(index)],
        y: [...accum.green.y, green_submittals / expected_total_submittals],
        hovertemplate: [
          ...accum.green.hovertemplate,
          `<b>On Time Count</b>: ${green_submittals}` + '<br /><i>%{y:.0%}</i>' + '<extra></extra>',
        ],
      },
      yellow: {
        ...accum.yellow,
        x: [...accum.yellow.x, displayString(index)],
        y: [...accum.yellow.y, yellow_submittals / expected_total_submittals],
        hovertemplate: [
          ...accum.yellow.hovertemplate,
          `<b>Late Count</b>: ${yellow_submittals}` + '<br /><i>%{y:.0%}</i>' + '<extra></extra>',
        ],
      },
      red: {
        ...accum.red,
        x: [...accum.red.x, displayString(index)],
        y: [...accum.red.y, (red_submittals / expected_total_submittals)],
        hovertemplate: [
          ...accum.red.hovertemplate,
          `<b>Missing Count</b>: ${red_submittals}` + '<br /><i>%{y:.0%}</i>' + '<extra></extra>',
        ],
      }
    }
  }, {
    green: defaultTrace('On Time', 'green'),
    yellow: defaultTrace('Late', 'yellow'),
    red: defaultTrace('Missing', 'red'),
  });
};

const DistrictRollupModal = connect(
  'doFetchDistrictRollup',
  'selectDistrictRollupRaw',
  ({
    doFetchDistrictRollup,
    districtRollupRaw
  }) => {
    const { evaluation, measurement } = districtRollupRaw;

    const [dateRange, setDateRange] = useState([subDays(new Date(), 365), new Date()]);
    const [fromTime, endTime] = dateRange;

    const evaluationTraces = generateDataTraces(evaluation);
    const measurementTraces = generateDataTraces(measurement);

    useEffect(() => {
      doFetchDistrictRollup('evaluation');
      doFetchDistrictRollup('measurement');
    }, [doFetchDistrictRollup]);

    const evaluationChartData = [evaluationTraces.red, evaluationTraces.yellow, evaluationTraces.green];
    const measurementChartData = [measurementTraces.red, measurementTraces.yellow, measurementTraces.green];

    const tabs = [{
      title: 'Evaluation Rollup',
      content: (
        <Chart
          data={evaluationChartData}
          layout={{
            barmode: 'stack',
            title: {
              text: 'Evaluation Rollup Chart',
            },
            yaxis: {
              tickformat: '~%',
              range: [0, 1],
              title: {
                text: 'Evaluation Submittal Percentage (%)',
                standoff: 3,
              },
            },
          }}
          config={{
            displayModeBar: false,
          }}
        />
      ),
    }, {
      title: 'Measurement Rollup',
      content: (
        <Chart
          data={measurementChartData}
          layout={{
            barmode: 'stack',
            title: {
              text: 'Measurement Rollup Chart',
            },
            yaxis: {
              tickformat: '~%',
              range: [0, 1],
              title: {
                text: 'Measurement Submittal Percentage (%)',
                standoff: 3,
              },
            },
          }}
          config={{
            displayModeBar: false,
          }}
        />
      ),
    }];

    return (
      <ModalContent>
        <ModalHeader title='District Rollup' />
        <ModalBody>
          <>
            <div className='row'>
              <div className='col-3'>
                <label>Start Date:</label>
                <ReactDatePicker
                  className='form-control'
                  selected={fromTime}
                  onChange={(update) => setDateRange(prev => [update, prev[1]])}
                  showMonthDropdown
                  showYearDropdown
                  dateFormat='MMMM d, yyyy'
                />
              </div>
              <div className='col-3'>
                <label>End Date:</label>
                <ReactDatePicker
                  className='form-control'
                  selected={endTime}
                  onChange={(update) => setDateRange(prev => [prev[0], update])}
                  showMonthDropdown
                  showYearDropdown
                  dateFormat='MMMM d, yyyy'
                />
              </div>
            </div>
            <hr />
            <TabContainer tabs={tabs} />            
          </>
        </ModalBody>
        <ModalFooter
          showCancelButton
          showSaveButton={false}
          cancelText='Close'
        />
      </ModalContent>
    );
  },
);

export default DistrictRollupModal;
