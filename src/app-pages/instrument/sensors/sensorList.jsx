import React from 'react';
import { useDeepCompareEffect } from 'react-use';

import { classArray } from '../../../common/helpers/utils';

const SensorList = ({
  activeSensorId,
  setActiveSensorId,
  instrumentSensors,
}) => {
  const itemClass = (sensorId) => classArray([
    'list-group-item',
    'pointer',
    sensorId === activeSensorId && 'active',
  ]);

  useDeepCompareEffect(() => {
    if (instrumentSensors.length) {
      setActiveSensorId(instrumentSensors[0]?.id);
    }
  }, [instrumentSensors]);

  return (
    instrumentSensors.length ? (
      <>
        {instrumentSensors.map(sensor => (
          <li
            key={sensor.id}
            className={itemClass(sensor.id)}
            onClick={() => setActiveSensorId(sensor.id)} // @TODO: Also fetch segment details by id for use in detail screen
          >
            {sensor.id}
          </li>
        ))}
      </>
    ) : 'No Sensors'
  );
};

export default SensorList;
