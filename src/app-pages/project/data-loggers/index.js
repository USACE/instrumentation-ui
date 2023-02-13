import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { connect } from 'redux-bundler-react';

import Button from '../../../app-components/button';
import Card from '../../../app-components/card';
import DataLoggerDetails from './dataLoggerDetails';
import DataLoggerMappingTable from './tables/dataLoggerMappingTable';
import DataLoggerModal from './modals/dataLoggerModal';
import IncomingRawDataTable from './tables/incomingRawDataTable';

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
    selectDataLoggerEquivalencyTable: equivalencyTable,
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
            <Button
              isOutline
              className='d-inline-block float-right'
              size='small'
              variant='success'
              text='+ Add New Data Logger'
              handleClick={() => doModalOpen(DataLoggerModal)}
            />
          </Card.Body>
        </Card>
        {selectedDataLogger ? (
          <>
            <DataLoggerDetails dataLogger={dataLoggerInfo} />
            <IncomingRawDataTable doModalOpen={doModalOpen} rawData={{}} />
            <DataLoggerMappingTable equivalency={equivalencyTable} />
          </>
        ) : null}
      </div>
    );
  }
);

export default DataLoggers;
