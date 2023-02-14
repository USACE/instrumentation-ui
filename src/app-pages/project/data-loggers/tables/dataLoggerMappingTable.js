import React from 'react';
import { connect } from 'redux-bundler-react';

import Button from '../../../../app-components/button';
import Card from '../../../../app-components/card';
import Icon from '../../../../app-components/icon';
import Table from '../../../../app-components/table';

const instrumentSort = (rowA, rowB, instruments) => {
  const { instrument_id: instrumentIdA } = rowA?.original;
  const { instrument_id: instrumentIdB } = rowB?.original;

  const instrumentAName = instruments.find(el => el.id === instrumentIdA)?.name;
  const instrumentBName = instruments.find(el => el.id === instrumentIdB)?.name;

  return instrumentAName?.localeCompare(instrumentBName);
};

const timeseriesSort = (rowA, rowB, timeseries) => {
  const { timeseries_id: timeseriesIdA } = rowA?.original;
  const { timeseries_id: timeseriesIdB } = rowB?.original;

  const timeseriesAName = timeseries[timeseriesIdA]?.name;
  const timeseriesBName = timeseries[timeseriesIdB]?.name;

  return timeseriesAName?.localeCompare(timeseriesBName);
};

const DataLoggerMappingTable = connect(
  'selectInstrumentsItems',
  'selectInstrumentTimeseriesItemsObject',
  ({
    instrumentsItems: instruments,
    instrumentTimeseriesItemsObject: timeseries,
    equivalency = {},
  }) => {
    const { rows = [] } = equivalency;
    
    return (
      <Card className='mt-3'>
        <Card.Header text='Field Mapping Table' />
        <Card.Body>
          <Table
            data={rows}
            columns={[{
              key: 'edit',
              render: () => (
                <Button
                  isOutline
                  size='small'
                  variant='info'
                  icon={<Icon icon='pencil' />}
                  title='Edit Field Mapping'
                />
              ),
            }, {
              key: 'field_name',
              header: 'Field Name',
              isSortable: true,
            }, {
              key: 'display_name',
              header: 'Display Name',
              isSortable: true,
            }, {
              key: 'instrument_id',
              header: 'Instrument',
              isSortable: true,
              sortingFn: (rowA, rowB) => instrumentSort(rowA, rowB, instruments),
              render: (data) => {
                const i = instruments?.find(el => el.id === data.instrument_id);
                return <span>{i?.name}</span>;
              },
            }, {
              key: 'timeseries_id',
              header: 'Timeseries',
              isSortable: true,
              sortingFn: (rowA, rowB) => timeseriesSort(rowA, rowB, timeseries),
              render: (data) => {
                const t = timeseries[data.timeseries_id];
                return <span>{t?.name}</span>;
              }
            }]}
          />
        </Card.Body>
      </Card>
    );
  },
);

export default DataLoggerMappingTable;
