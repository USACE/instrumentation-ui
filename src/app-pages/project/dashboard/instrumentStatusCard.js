import React from 'react';

import Card from '../../../app-components/card';
import Chart from '../../../app-components/chart/chart';

const InstrumentStatusCard = () => (
  <Card>
    <Card.Header text='Instrument Status' />
    <Card.Body hasHorizontalPadding={false}>
      <Chart
        style={{ paddingLeft: '-20px' }}
        data={[{
          values: [4, 12, 18],
          labels: ['Abandoned', 'Destroyed', 'Active'],
          type: 'pie',
          hole: 0.58,
        }]}
      />
    </Card.Body>
  </Card>
);

export default InstrumentStatusCard;
