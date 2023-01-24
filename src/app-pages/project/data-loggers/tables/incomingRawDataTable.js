import React from 'react';

import Button from '../../../../app-components/button';
import Card from '../../../../app-components/card';
import RawJSONModal from '../modals/rawJsonModal';
import Table from '../../../../app-components/table';
import Icon from '../../../../app-components/icon';

const IncomingRawDataTable = ({
  doModalOpen,
  rawData = {},
}) => (
  <Card className='mt-3'>
    <Card.Body>
      Raw Data Table
      <div className='row'>
        <div className='col-12'>
          <Button
            isOutline
            size='small'
            variant='info'
            icon={<Icon icon='refresh' />}
            title='Refresh Raw Data'
            className='mr-2'
            handleClick={() => doModalOpen(RawJSONModal, { rawData }, 'lg')}
          />
          <Button
            isOutline
            size='small'
            variant='info'
            icon={<Icon icon='copy' />}
            text='Field Names -> Mapping Table'
            title='Send Field Names to Mapping Table'
            className='mr-2'
            handleClick={() => doModalOpen(RawJSONModal, { rawData }, 'lg')}
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
