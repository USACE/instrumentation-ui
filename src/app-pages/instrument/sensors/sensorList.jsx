import React from 'react';
import { useDeepCompareEffect } from 'react-use';

import { classArray } from '../../../common/helpers/utils';

const SensorList = ({
  activeSensor,
  setActiveSensor,
  instrumentSensors,
}) => {
  const itemClass = (sensorId) => classArray([
    'list-group-item',
    'pointer',
    sensorId === activeSensor && 'active',
  ]);

  useDeepCompareEffect(() => {
    if (instrumentSensors.length) {
      setActiveSensor(instrumentSensors[0]);
    }
  }, [instrumentSensors]);

  return (
    instrumentSensors.length ? (
      <>
        {instrumentSensors.map(sensor => (
          <li
            key={sensor.id}
            className={itemClass(sensor.id)}
          >
            {sensor.name}
          </li>
        ))}
      </>
    ) : 'No Sensors'
  );
};

export default SensorList;
