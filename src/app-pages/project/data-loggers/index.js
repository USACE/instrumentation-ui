import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { connect } from 'redux-bundler-react';

import Button from '../../../app-components/button';
import Card from '../../../app-components/card';
import DataLoggerDetails from './dataLoggerDetails';
import DataLoggerMappingTable from './tables/dataLoggerMappingTable';
import DataLoggerModal from './modals/dataLoggerModal';
import IncomingRawDataTable from './tables/incomingRawDataTable';
import Icon from '../../../app-components/icon';

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
  'selectDataLoggerEquivalencyTable',
  ({
    doModalOpen,
    doFetchDataLoggersByProjectId,
    doFetchDataLoggerEquivalency,
    projectDataLoggers: dataLoggers,
    dataLoggerEquivalencyTable: equivalencyTable,
  }) => {
    const [selectedDataLogger, setSelectedDataLogger] = useState('');
    const dataLoggerInfo = dataLoggers?.find(el => el?.id === selectedDataLogger?.value);

    useEffect(() => {
      doFetchDataLoggersByProjectId();
    }, [doFetchDataLoggersByProjectId]);

    useEffect(() => {
      if (!!selectedDataLogger) {
        doFetchDataLoggerEquivalency({ dataLoggerId: selectedDataLogger?.value });
      }
    }, [selectedDataLogger, doFetchDataLoggerEquivalency]);

    return (
      <div className='container-fluid'>
        <Card>
          <Card.Body>
            {dataLoggers.length ? (
              <Select
                className='d-inline-block w-50'
                placeholder='Select a Data Logger...'
                options={generateDataLoggerOptions(dataLoggers)}
                onChange={val => setSelectedDataLogger(val)}
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
                    icon={<Icon icon='pencil' />}
                    title='Edit Data Logger'
                    handleClick={() => {}}
                  />
                  <Button
                    isOutline
                    size='small'
                    variant='danger'
                    className='mr-2'
                    icon={<Icon icon='trash-can' />}
                    title='Delete Data Logger'
                    handleClick={() => {}}
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
            <IncomingRawDataTable doModalOpen={doModalOpen} />
            <DataLoggerMappingTable equivalency={equivalencyTable} />
          </>
        ) : null}
      </div>
    );
  }
);

export default DataLoggers;
