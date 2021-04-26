import React from 'react';
import { connect } from 'redux-bundler-react';

import Card from '../../../app-components/card';
import Chart from '../../../app-components/chart/chart';

const reduceInstrumentsByStatus = instruments => {
  const increment = (value = 0) => ++value;
  
  return instruments.reduce(
    (accum, elem) => ({
      ...accum,
      [elem.status]: increment(accum[elem.status]),
    }), {});
};

const InstrumentStatusCard = connect(
  'selectInstrumentsItems',
  ({
    instrumentsItems: instruments,
  }) => {
    const instrumentsByStatus = reduceInstrumentsByStatus(instruments);

    return (
      <Card>
        <Card.Header text='Instrument Status' />
        <Card.Body hasHorizontalPadding={false}>
          <Chart
            style={{ paddingLeft: '-20px' }}
            data={[{
              values: Object.keys(instrumentsByStatus).map(key => instrumentsByStatus[key]),
              labels: Object.keys(instrumentsByStatus).map(key => key),
              type: 'pie',
              textinfo: 'value',
              hole: 0.58,
            }]}
          />
        </Card.Body>
      </Card>
    );
  }
);

export default InstrumentStatusCard;
