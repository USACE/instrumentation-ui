import React, { useReducer } from 'react';
import Select from 'react-select';
import { connect } from 'redux-bundler-react';

import Button from '../../../app-components/button';
import { reduceState } from '../../../common/helpers/form-helpers';

const generateOptions = timeseries => (
  timeseries.map(ts => ({
    label: ts.name,
    value: ts.id,
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
    const [options, dispatch] = useReducer(reduceState, activeSensor);

    const tsOpts = generateOptions(timeseries);

    const getOption = tsId => {
       return tsOpts.find(opt => opt.value === activeSensor[tsId])
    };

    const handleSave = () => doUpdateInstrumentSensor(options);

    return (
      <>
        {activeSensor === undefined ? (
          <i>Select a Sensor to assign or view mapped timeseries.</i>
        ) : (
          <>
            <div className='row'>
              <div className='col-3'>
                <label>X Timeseries:</label>
                <Select
                  value={getOption('x_timeseries_id')}
                  className='d-inline-block w-100'
                  onChange={item => dispatch({ type: 'update', key: 'x_timeseries_id', data: item })}
                  options={tsOpts}
                />
              </div>
              <div className='col-3'>
                <label>Y Timeseries</label>
                <Select
                  value={getOption('y_timeseries_id')}
                  className='d-inline-block w-100'
                  onChange={item => dispatch({ type: 'update', key: 'y_timeseries_id', data: item })}
                  options={tsOpts}
                />
              </div>
              <div className='col-3'>
                <label>Z Timeseries</label>
                <Select
                  value={getOption('z_timeseries_id')}
                  className='d-inline-block w-100'
                  onChange={item => dispatch({ type: 'update', key: 'z_timeseries_id', data: item })}
                  options={tsOpts}
                />
              </div>
              <div className='col-3'>
                <label>Temperature Timeseries</label>
                <Select
                  value={getOption('temp_timeseries_id')}
                  className='d-inline-block w-100'
                  onChange={item => dispatch({ type: 'update', key: 'temp_timeseries_id', data: item })}
                  options={tsOpts}
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
