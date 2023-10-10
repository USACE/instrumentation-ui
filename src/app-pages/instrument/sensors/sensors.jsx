import React, { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';

import SensorList from './sensorList';
import SensorDetails from './sensorDetails';

const Sensors = connect(
  'doFetchInstrumentSensorsById',
  'selectInstrumentSensors',
  ({
    doFetchInstrumentSensorsById,
    instrumentSensors,
  }) => {
    const [activeSensorId, setActiveSensorId] = useState(null);

    useEffect(() => {
      doFetchInstrumentSensorsById();
    }, [doFetchInstrumentSensorsById]);

    const activeSensor = instrumentSensors.find(s => s.id === activeSensorId)

    return (
      <div>
        <p>
          Each sensor's depth is determined by the number of segments on the SAA, taking slope angle into account. Each sensor should have four (4)
          timeseries mapped to them to be used in depth-based plotting. These timeseries should contain X, Y, Z and Temperature measurements.
        </p>
        <div className='row'>
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
                <SensorDetails
                  activeSensor={activeSensor}
                />
              </div>
            </>
          ) : <i className='col-12'>No Sensors for this instrument.</i>}
        </div>
      </div>
    );
  },
);

export default Sensors;
