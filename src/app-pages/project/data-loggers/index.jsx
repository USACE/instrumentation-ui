import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { connect } from 'redux-bundler-react';
import { useDeepCompareEffect } from 'react-use';
import { Delete, Edit, Key, UploadOutlined } from '@mui/icons-material';

import Button from '../../../app-components/button';
import Card from '../../../app-components/card';
import CycleApiKeyModal from './modals/cycleApiKeyModal';
import DataLoggerDetails from './dataLoggerDetails';
import DataLoggerMappingTable from './tables/dataLoggerMappingTable';
import DataLoggerModal from './modals/dataLoggerModal';
import DeleteDataLoggerModal from './modals/deleteDataLoggerModal';
import IncomingRawDataTable from './tables/incomingRawDataTable';
import Toa5Modal from './modals/toa5Modal';

const generateDataLoggerOptions = (dataLoggers = []) => (
  dataLoggers.map(logger => ({
    label: logger?.name,
    value: logger?.id,
  }))
);

const DataLoggers = connect(
  'doModalOpen',
  'doFetchDataLoggersByProjectId',
  'doFetchDataLoggerEquivalency',
  'selectProjectDataLoggers',
  'selectHashQuery',
  ({
    doModalOpen,
    doFetchDataLoggersByProjectId,
    doFetchDataLoggerEquivalency,
    projectDataLoggers: dataLoggers,
    hashQuery,
  }) => {
    const queryParamId = hashQuery?.id;

    const [selectedDataLogger, setSelectedDataLogger] = useState('');
    const [dataLoggerOptions, setDataLoggerOptions] = useState(generateDataLoggerOptions(dataLoggers));
    const dataLoggerInfo = dataLoggers?.find(el => el?.id === selectedDataLogger?.value);

    useEffect(() => {
      doFetchDataLoggersByProjectId();
    }, [doFetchDataLoggersByProjectId]);

    useEffect(() => {
      if (selectedDataLogger) {
        doFetchDataLoggerEquivalency({ dataLoggerId: selectedDataLogger?.value });
      }
    }, [selectedDataLogger, doFetchDataLoggerEquivalency]);

    useDeepCompareEffect(() => {
      setDataLoggerOptions(generateDataLoggerOptions(dataLoggers));

      if (queryParamId && dataLoggers?.length) {
        setSelectedDataLogger({ value: queryParamId, label: dataLoggers.find(el => el.id === queryParamId).name });
      }
    }, [dataLoggers, queryParamId]);

    return (
      <div className='container-fluid'>
        <Card>
          <Card.Body>
            {dataLoggers.length ? (
              <Select
                className='d-inline-block w-50'
                placeholder='Select a Data Logger...'
                options={dataLoggerOptions}
                onChange={val => setSelectedDataLogger(val)}
                value={selectedDataLogger}
              />
            ) : <span>No Data Loggers for this project. Add one using the <i>Add New Data Logger</i> button to the right.</span>}
            <div className='d-inline-block float-right'>
              {selectedDataLogger ? (
                <>
                  <Button
                    isOutline
                    size='small'
                    variant='info'
                    className='mr-2'
                    title='Upload TOA5 File'
                    icon={<UploadOutlined fontSize='inherit' />}
                    handleClick={() => doModalOpen(Toa5Modal, { dataLoggerInfo }, 'lg')}
                  />
                  <Button
                    isOutline
                    size='small'
                    variant='info'
                    className='mr-2'
                    icon={<Edit fontSize='inherit' />}
                    title='Edit Data Logger'
                    handleClick={() => doModalOpen(
                      DataLoggerModal,
                      {
                        isEdit: true,
                        dataLogger: {
                          id: selectedDataLogger?.value,
                          name: dataLoggerInfo?.name,
                        },
                        callback: (val) => setSelectedDataLogger(val),
                      }
                    )}
                  />
                  <Button
                    isOutline
                    size='small'
                    variant='warning'
                    className='mr-2'
                    icon={<Key fontSize='inherit' />}
                    title='Cycle API Key'
                    handleClick={() => doModalOpen(CycleApiKeyModal, { dataLoggerInfo })}
                  />
                  <Button
                    isOutline
                    size='small'
                    variant='danger'
                    className='mr-2'
                    icon={<Delete fontSize='inherit' />}
                    title='Delete Data Logger'
                    handleClick={() => doModalOpen(DeleteDataLoggerModal, { dataLoggerInfo, callback: () => setSelectedDataLogger(null) })}
                  />
                </>
              ) : null}
              <Button
                isOutline
                size='small'
                variant='success'
                text='+ Add New Data Logger'
                handleClick={() => doModalOpen(DataLoggerModal)}
              />
            </div>
          </Card.Body>
        </Card>
        {selectedDataLogger ? (
          <>
            <DataLoggerDetails dataLogger={dataLoggerInfo} />
            <IncomingRawDataTable dataLogger={dataLoggerInfo} />
            <DataLoggerMappingTable dataLogger={dataLoggerInfo} />
          </>
        ) : null}
      </div>
    );
  }
);

export default DataLoggers;
