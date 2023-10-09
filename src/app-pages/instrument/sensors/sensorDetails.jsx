import React, { useReducer } from 'react';
import Select from 'react-select';
import { connect } from 'redux-bundler-react';

import Button from '../../../app-components/button';
import { reduceState } from '../../../common/helpers/form-helpers';

const generateOptions = timeseries => (
  timeseries.map(ts => ({
    label: ts.name,
    value: ts.timeseriesId,
  }))
);

const SensorDetails = connect(
  'doUpdateInstrumentSensor',
  'selectInstrumentTimeseriesItemsByRoute',
  ({
    doUpdateInstrumentSensor,
    instrumentTimeseriesItemsByRoute: timeseries,
    activeSensor,
  }) => {
    // @TODO: grab current segment values to use as default.
    const [options, dispatch] = useReducer(reduceState, { x: null, y: null, z: null, temp: null });

    const handleSave = () => doUpdateInstrumentSensor(options);

    return (
      <>
        {!activeSensor ? (
          <i>Select a Sensor to assign or view mapped timeseries.</i>
        ) : (
          <>
            <div className='row'>
              <div className='col-3'>
                <label>X Timeseries:</label>
                <Select
                  className='d-inline-block w-100'
                  onChange={item => dispatch({ type: 'update', key: 'x', data: item })}
                  options={generateOptions(timeseries)}
                />
              </div>
              <div className='col-3'>
                <label>Y Timeseries</label>
                <Select
                  className='d-inline-block w-100'
                  onChange={item => dispatch({ type: 'update', key: 'y', data: item })}
                  options={generateOptions(timeseries)}
                />
              </div>
              <div className='col-3'>
                <label>Z Timeseries</label>
                <Select
                  className='d-inline-block w-100'
                  onChange={item => dispatch({ type: 'update', key: 'z', data: item })}
                  options={generateOptions(timeseries)}
                />
              </div>
              <div className='col-3'>
                <label>Temperature Timeseries</label>
                <Select
                  className='d-inline-block w-100'
                  onChange={item => dispatch({ type: 'update', key: 'temp', data: item })}
                  options={generateOptions(timeseries)}
                />
              </div>
            </div>
            <Button
              isOutline
              size='small'
              variant='success'
              text='Save Segment Config'
              handleClick={handleSave}
            />
          </>
        )}
      </>
    );
  },
);

export default SensorDetails;
