import React, { useState } from 'react';
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
  'selectProjectDataLoggersItems',
  ({
    doModalOpen,
    projectDataLoggersItems: dataLoggers,
  }) => {
    const [selectedDataLogger, setSelectedDataLogger] = useState('test');

    console.log('test dataLoggers: ', dataLoggers);

    return (
      <div className='container-fluid'>
        <Card>
          <Card.Body>
            {dataLoggers.length ? (
              <Select
                placeholder='Select a Data Logger...'
                options={generateDataLoggerOptions(dataLoggers)}
                onChange={val => setSelectedDataLogger(val)}
              />
            ) : <span>No Data Loggers for this project. Add one using the <i>Add New Data Logger</i> button to the right.</span>}
            <Button
              isOutline
              className='float-right'
              size='small'
              variant='success'
              text='+ Add New Data Logger'
              handleClick={() => doModalOpen(DataLoggerModal)}
            />
          </Card.Body>
        </Card>
        {selectedDataLogger ? (
          <>
            <DataLoggerDetails dataLogger={{}} />
            <IncomingRawDataTable doModalOpen={doModalOpen} />
            <DataLoggerMappingTable />
          </>
        ) : null}
      </div>
    );
  }
);

export default DataLoggers;
