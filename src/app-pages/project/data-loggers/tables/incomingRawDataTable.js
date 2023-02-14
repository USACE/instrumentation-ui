import React, { useState } from 'react';
import { toast } from 'react-toastify';

import Button from '../../../../app-components/button';
import Card from '../../../../app-components/card';
import Icon from '../../../../app-components/icon';

import testData from './testData';

const IncomingRawDataTable = ({
  rawData = testData,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dataString = JSON.stringify(rawData, null, 4);
  
  return (
    <Card className='mt-3'>
      <Card.Header>
        <Button
          className='text-primary p-0 mr-2'
          variant='link'
          icon={<Icon icon={isOpen ? 'minus' : 'plus'} />}
          handleClick={() => setIsOpen(!isOpen)}
          title={isOpen ? 'Collapse Section' : 'Expand Section'}
        />
        <strong>Raw Data Preview</strong>
      </Card.Header>
      <Card.Body>
        {isOpen ? (
          <>
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
                  icon={<Icon icon='content-copy' />}
                  text='Copy to Clipboard'
                  handleClick={() => {
                    try {
                      navigator.clipboard.writeText(dataString);
                      toast.success('Copied to Clipboard!', { autoClose: 1500 });
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                />
              </div>
            </div>
            <textarea
              readOnly
              rows={18}
              className='w-100'
              value={dataString}
            />
          </>
        ) : <i>Expand to see previewed data...</i>}
      </Card.Body>
    </Card>
  );
};

export default IncomingRawDataTable;
