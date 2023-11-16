import React from 'react';
import { connect } from 'redux-bundler-react';
import { Delete, Edit } from '@mui/icons-material';

import AssignTimeseriesModal from '../modals/assignTimeseriesModal';
import Button from '../../../../app-components/button';
import Card from '../../../../app-components/card';
import DeleteDataLoggerMappingRowModal from '../modals/deleteDataLoggerMappingRowModal';
import EditMappingRowModal from '../modals/editMappingRowModal';
import Table from '../../../../app-components/table';

const instrumentSort = (rowA, rowB, instruments) => {
  const { instrument_id: instrumentIdA } = rowA?.original || {};
  const { instrument_id: instrumentIdB } = rowB?.original || {};

  const instrumentAName = instruments.find(el => el.id === instrumentIdA)?.name;
  const instrumentBName = instruments.find(el => el.id === instrumentIdB)?.name;

  if (!instrumentAName) return 1;
  if (!instrumentBName) return -1;

  return (instrumentAName || '').localeCompare(instrumentBName);
};

const timeseriesSort = (rowA, rowB, timeseries) => {
  const { timeseries_id: timeseriesIdA } = rowA?.original || {};
  const { timeseries_id: timeseriesIdB } = rowB?.original || {};

  const timeseriesAName = timeseries[timeseriesIdA]?.name;
  const timeseriesBName = timeseries[timeseriesIdB]?.name;

  if (!timeseriesAName) return 1;
  if (!timeseriesBName) return -1;

  return (timeseriesAName || '').localeCompare(timeseriesBName);
};

const DataLoggerMappingTable = connect(
  'doModalOpen',
  'selectInstrumentsItems',
  'selectInstrumentTimeseriesItemsObject',
  'selectDataLoggerEquivalencyTable',
  ({
    doModalOpen,
    instrumentsItems: instruments,
    instrumentTimeseriesItemsObject: timeseries,
    dataLoggerEquivalencyTable: equivalencyTable,
    dataLogger,
  }) => {
    const { rows = [] } = equivalencyTable;
    const { id } = dataLogger;
    
    return (
      <Card className='mt-3'>
        <Card.Header>
          <div className='row'>
            <div className='col-6 pt-1'>
              <strong>Field Mapping Table</strong>
            </div>
            <div className='col-6 float-right'>
              <Button
                isOutline
                className='float-right'
                variant='info'
                size='small'
                text='Auto-assign Timeseries'
                handleClick={() => doModalOpen(AssignTimeseriesModal, { equivalencyTable })}
              />
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          <Table
            data={rows}
            columns={[{
              key: 'actions',
              render: (data) => (
                <>
                  <Button
                    isOutline
                    size='small'
                    variant='info'
                    className='mr-2'
                    icon={<Edit fontSize='inherit' />}
                    title='Edit Field Mapping'
                    handleClick={() => doModalOpen(EditMappingRowModal, { rowData: data, dataLoggerId: id })}
                  />
                  <Button
                    isOutline
                    size='small'
                    variant='danger'
                    icon={<Delete fontSize='inherit' />}
                    title='Remove Field Mapping'
                    handleClick={() => doModalOpen(DeleteDataLoggerMappingRowModal, { dataLoggerId: id, id: data?.id })}
                  />
                </>
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
