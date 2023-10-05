import React from 'react';

const SensorDetails = ({
  activeSensor,
}) => (
  <>
    {!activeSensor ? (
      <i>Select a Sensor to assign or view mapped timeseries.</i>
    ) : (
      <div>
      </div>
    )}
  </>
);

export default SensorDetails;
