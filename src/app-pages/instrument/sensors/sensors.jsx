import React, { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';

import AutomapSensorModal from './automapSensorModal';
import Button from '../../../app-components/button';
import SensorDetails from './sensorDetails';
import SensorList from './sensorList';

const Sensors = connect(
  'doModalOpen',
  'doFetchInstrumentSensorsById',
  'selectInstrumentSensors',
  ({
    doModalOpen,
    doFetchInstrumentSensorsById,
    instrumentSensors,
    type,
  }) => {
    const [activeSensorId, setActiveSensorId] = useState(null);

    const activeSensor = instrumentSensors.find(s => s.id === activeSensorId);

    useEffect(() => {
      doFetchInstrumentSensorsById(type);
    }, [doFetchInstrumentSensorsById]);

    return (
      <div>
        <p className='p-0 m-0'>
          {type === 'saa' && (
            <span>
              Each sensor should have four (4) timeseries mapped to them to be used in depth-based plotting. These timeseries should contain 
              X, Y, Z and Temperature measurements. Initial values can be autofilled if the format of the timeseries' names is consistent with 
              the following example: <i>string_name(n1,n2,n3)</i> for X, Y, Z or <i>string_name(n1,n2)</i> for Temperature.
            </span>
          )}
          {type === 'ipi' && (
            <span>
              Each sensor should have at a minimum two (2) timeseries mapped to them to be used in depth-based plotting. For calculating the
              Cumulative Displacement, Length as well as one of Tilt or Incremental Displacement timeseries should be populated. If both Incremental
              Displacement and Tilt are supplied, Incremental Displacement will be used in the calculation. If Incremental Displacement is not supplied,
              Tilt and Segment Length are used to calculate displacement. If neither Incremental Displacement nor Tilt exist, Cumulative Displacement
              cannot be calculated. Temperature is optional and will be used to generate a graph to show Temperature delta alongside the Cumulative Displacement.
            </span>
          )}
        </p>
        <div className='row mt-2'>
          <div className='col-12'>
            {type !== 'ipi' && (
              <Button
                isOutline
                size='small'
                variant='info'
                text='Auto-assign Sensor Timeseries'
                handleClick={() => doModalOpen(AutomapSensorModal, { type }, 'lg')}
              />
            )}
          </div>
        </div>
        <div className='row mt-2'>
          {instrumentSensors.length ? (
            <>
              <div className='col-3'>
                <SensorList
                  activeSensorId={activeSensorId}
                  setActiveSensorId={setActiveSensorId}
                  instrumentSensors={instrumentSensors}
                />
              </div>
              <div className='col-9'>
                {!!activeSensor && <SensorDetails activeSensor={activeSensor} type={type} />}
              </div>
            </>
          ) : <i className='col-12'>No Sensors for this instrument.</i>}
        </div>
      </div>
    );
  },
);

export default Sensors;
