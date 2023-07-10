import React from 'react';
import { connect } from 'redux-bundler-react';
import Select from 'react-select';

import Chart from '../../../../../app-components/chart/chart';
import { ModalContent, ModalBody, ModalFooter, ModalHeader } from '../../../../../app-components/modal';

const DistrictRollupModal = connect(
  'doModalClose',
  ({
    doModalClose
  }) => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const trace1 = {
      x: months,
      y: [26, 100, 40, 26, 50, 40, 26, 80, 40, 26, 0, 40],
      name: 'Okay',
      type: 'bar',
      marker: {
        color: 'green',
      }
    };
    
    const trace2 = {
      x: months,
      y: [14, 0, 40, 14, 20, 40, 14, 0, 40, 14, 0, 40],
      name: 'Warning',
      type: 'bar',
      marker: {
        color: 'yellow',
      }
    };

    const trace3 = {
      x: months,
      y: [60, 0, 20, 60, 30, 20, 60, 20, 20, 60, 100, 20],
      name: 'Error',
      type: 'bar',
      marker: {
        color: 'red',
      }
    };

    const dataValues = [trace3, trace2, trace1];

    return (
      <ModalContent>
        <ModalHeader title='District Rollup (Mock Data)' />
        <ModalBody>
          <>
            <Chart
              data={dataValues}
              layout={{
                barmode: 'stack'
              }}
              config={{
                displayModeBar: false,
              }}
            />
            <hr />
            Display Options:
            <Select
              placeholder='Year Format'
              options={[
                { label: 'Calendar' },
                { label: 'Fiscal' }
              ]}
            />
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
