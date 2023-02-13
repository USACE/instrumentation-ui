import React from 'react';

import Button from '../../../../app-components/button';
import Card from '../../../../app-components/card';
import Icon from '../../../../app-components/icon';
import RawJSONModal from '../modals/rawJsonModal';
import Table from '../../../../app-components/table';

const IncomingRawDataTable = ({
  doModalOpen,
  rawData = {},
}) => (
  <Card className='mt-3'>
    <Card.Header text='Raw Data Table' />
    <Card.Body>
      <div className='row mb-2'>
        <div className='col-12'>
          <Button
            isOutline
            size='small'
            variant='info'
            icon={<Icon icon='refresh' />}
            title='Refresh Raw Data'
            className='mr-2'
            handleClick={() => {}}
          />
          <Button
            isOutline
            size='small'
            variant='info'
            text='Field Names -> Mapping Table'
            title='Send Field Names to Mapping Table'
            className='mr-2'
            handleClick={() => {}}
          />
          <Button
            isOutline
            size='small'
            variant='primary'
            text='View Raw JSON'
            handleClick={() => doModalOpen(RawJSONModal, { rawData }, 'lg')}
          />
        </div>
      </div>
      <Table
        data={[]}
        columns={[]}
      />
    </Card.Body>
  </Card>
);

export default IncomingRawDataTable;
