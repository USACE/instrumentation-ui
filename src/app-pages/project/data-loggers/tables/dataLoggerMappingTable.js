import React from 'react';

import Card from '../../../../app-components/card';
import Table from '../../../../app-components/table';

const DataLoggerMappingTable = () => (
  <Card className='mt-3'>
    <Card.Body>
      Mapping Table

      <Table
        data={[]}
        columns={[]}
      />
    </Card.Body>
  </Card>
);

export default DataLoggerMappingTable;
