import React from 'react';
import { connect } from 'redux-bundler-react';

import Card from '../../../../app-components/card';
import Chart from '../../../../app-components/chart/chart';

const increment = (value = 0) => ++value;

const reduceInstrumentsByStatus = instruments => (
  instruments.reduce(
    (accum, elem) => ({
      ...accum,
      [elem.status]: increment(accum[elem.status]),
    }), {})
);

const InstrumentStatusCard = connect(
  'selectInstrumentsItems',
  ({
    instrumentsItems: instruments,
  }) => {
    const instrumentsByStatus = reduceInstrumentsByStatus(instruments);
    const dataValues = Object.values(instrumentsByStatus);

    return (
      <Card className='mt-4'>
        <Card.Header text='Instrument Status' />
        <Card.Body hasPaddingHorizontal={false} hasPaddingVertical={false}>
          {dataValues.length ? (
            <Chart
              data={[{
                values: dataValues,
                labels: Object.keys(instrumentsByStatus),
                type: 'pie',
                textinfo: 'value',
                hole: 0.58,
              }]}
              layout={{
                height: 300,
                margin: {
                  l: 20,
                  t: 30,
                  r: 20,
                  b: 30,
                }
              }}
              config={{
                displayModeBar: false,
              }}
            />
          ) : (
            <p className='m-3'>
              Add Instruments to view this graph.
            </p>
          )}
        </Card.Body>
      </Card>
    );
  }
);

export default InstrumentStatusCard;
