import React from 'react';

import Card from '../../../app-components/card';
import ProgressBar from '../../../app-components/progress-bar';

const InstrumentMeasurementCard = () => (
  <Card>
    <Card.Header text='Instrument Groups' />
    <Card.Body>
      <p className='text-primary table-heading'>Active Measurements Today</p>
      <div className='measurement-row'>
        <a href='#'>Mohawk Dam</a>
        <ProgressBar percent={52} />
        <p className='measurement'>52</p>
      </div>
    </Card.Body>
  </Card>
);

export default InstrumentMeasurementCard;
