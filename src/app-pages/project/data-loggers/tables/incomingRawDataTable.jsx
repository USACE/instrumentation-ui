import React, { useState } from 'react';
import { connect } from 'redux-bundler-react';
import { toast } from 'react-toastify';
import { useDeepCompareEffect } from 'react-use';

import * as extractorFns from '../dataLoggerFieldMappers';
import AddMappingRowsModal from '../modals/addMappingRowsModal';
import Button from '../../../../app-components/button';
import Card from '../../../../app-components/card';
import HelperTooltip from '../../../../app-components/helper-tooltip';
import { Add, ContentCopy, Refresh, Remove } from '@mui/icons-material';

const IncomingRawDataTable = connect(
  'doModalOpen',
  'doFetchDataLoggerPreview',
  'selectDataLoggerPreview',
  ({
    doModalOpen,
    doFetchDataLoggerPreview,
    dataLoggerPreview,
    dataLogger,
  }) => {
    const { id, model } = dataLogger;
    const { preview = {} } = dataLoggerPreview;

    const [isOpen, setIsOpen] = useState(false);
    const dataString = JSON.stringify(preview, null, 4);

    useDeepCompareEffect(() => {
      doFetchDataLoggerPreview({ dataLoggerId: id });
    }, [dataLogger, doFetchDataLoggerPreview]);
    
    return (
      <Card className='mt-3'>
        <Card.Header>
          <Button
            className='text-primary p-0 mr-2'
            variant='link'
            icon={isOpen ? <Remove /> : <Add /> }
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
                    icon={<Refresh fontSize='inherit' />}
                    title='Refresh Raw Data'
                    className='mr-2'
                    handleClick={() => doFetchDataLoggerPreview({ dataLoggerId: id })}
                  />
                  <Button
                    isOutline
                    size='small'
                    variant='info'
                    text='Field Names -> Mapping Table'
                    title='Send Field Names to Mapping Table'
                    className='mr-2'
                    handleClick={() => {
                      const myExtractor = extractorFns[`${model}_fieldNameExtractor`];
                      const fieldNames = myExtractor(preview);
                      doModalOpen(AddMappingRowsModal, { fieldNames, dataLoggerId: id });
                    }}
                  />
                  <Button
                    isOutline
                    size='small'
                    icon={<ContentCopy fontSize='inherit' />}
                    text='Copy to Clipboard'
                    handleClick={() => {
                      try {
                        navigator.clipboard.writeText(dataString);
                        toast.success('Copied to Clipboard!', { autoClose: 1200 });
                      } catch (e) {
                        console.error(e);
                      }
                    }}
                  />
                  <HelperTooltip
                    id='preview-help'
                    place='left'
                    content={
                      <span>
                        This preview shows the most recent payload received from the data logger. If you are not seeing <br/>
                        data you are expecting to see here, check the connection and make sure the data logger is still <br />
                        transmitting correctly. <br /><br />
                        For historical data, please view the associated instrument and timeseries. Historical data will not<br/>
                        be shown in this preview window.
                      </span>
                    }
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
  },
);

export default IncomingRawDataTable;
