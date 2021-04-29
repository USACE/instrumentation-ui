import React from 'react';
import { connect } from 'redux-bundler-react';

import Card from '../../../../app-components/card';
import Chart from '../../../../app-components/chart/chart';

const increment = (value = 0) => ++value;

const reduceInstrumentsByType = instruments => (
  instruments.reduce(
    (accum, elem) => ({
      ...accum,
      [elem.type]: increment(accum[elem.type]),
    }), {})
);

const InstrumentTypeCard = connect(
  'selectInstrumentsItems',
  ({
    instrumentsItems: instruments,
  }) => {
    const instrumentsByType = reduceInstrumentsByType(instruments);

    return (
      <Card>
        <Card.Header text='Instrument Types' />
        <Card.Body>
          <Chart
            data={[{
              y: Object.values(instrumentsByType),
              x: Object.keys(instrumentsByType),
              type: 'bar',
              text: Object.values(instrumentsByType),
              textposition: 'auto',
              hoverinfo: 'none',
              orientation: 'v',
              base: 0,
            }]}
            layout={{
              height: 370,
              yaxis: {
                tickformat: ',d',
              },
              margin: {
                t: 20,
                r: 80,
                l: 80,
                b: 30,
                pad: 5,
              }
            }}
            config={{
              displayModeBar: false,
            }}
          />
        </Card.Body>
      </Card>
    );
  }
);

export default InstrumentTypeCard;

/**
 * To quickly switch this to horizontal bar chart, do the following:
 * 
 * 1. swap `x` and `y` keys
 * 2. replace `yaxis` with `xaxis`
 * 3. set `layout.orientation` to `h`
 * 4. Optionally replace `layout.height` with logarithmic function to prevent over growth with many bars:
 *   - `height: Math.log2(Object.keys(instrumentsByType).length) * 150,`
 */