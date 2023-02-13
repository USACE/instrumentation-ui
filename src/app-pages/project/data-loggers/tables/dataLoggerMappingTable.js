import React from 'react';

import Card from '../../../../app-components/card';
import Table from '../../../../app-components/table';

const DataLoggerMappingTable = ({
  equivalency,
}) => {
  const { rows = [] } = equivalency = {};
  
  return (
    <Card className='mt-3'>
      <Card.Header text='Field Map Table' />
      <Card.Body>
        <Table
          data={rows}
          columns={[{
            key: 'field_name',
            header: 'Field Name',
          }, {
            key: 'display_name',
            header: 'Display Name',
          }, {
            key: 'instrument_id',
            header: 'Instrument ID',
          }, {
            key: 'timeseries_id',
            header: 'Timeseries ID',
          }]}
        />
      </Card.Body>
    </Card>
  );
};

export default DataLoggerMappingTable;
