import React, { useState } from 'react';
import Select from 'react-select';
import { connect } from 'redux-bundler-react';
import { Add, Remove } from '@mui/icons-material';
import { subDays } from 'date-fns';

import Button from '../../../../app-components/button';
import Card from '../../../../app-components/card';
import { useDeepCompareEffect } from 'react-use';

const extractTimeseries = equivalency => {
  const ret = [];
  const { rows = [] } = equivalency || {};
  rows.forEach(row => {
    const { timeseries_id, field_name } = row;

    ret.push({
      timeseriesId: timeseries_id,
      fieldName: field_name,
    });
  });

  return ret;
};

const generateOptions = timeseries => (
  timeseries.map(ts => ({
    label: ts.fieldName,
    value: ts.timeseriesId,
  }))
);

const DataLoggerDepthPlots = connect(
  'doTimeseriesMeasurementsFetchById',
  'selectDataLoggerEquivalencyTable',
  'selectTimeseriesMeasurementsItemsObject',
  ({
    doTimeseriesMeasurementsFetchById,
    dataLoggerEquivalencyTable,
    timeseriesMeasurementsItemsObject,
    dataLogger,
  }) => {
    const { id, model } = dataLogger;

    const [isOpen, setIsOpen] = useState(false);
    const [dateRange, setDateRange] = useState([subDays(new Date(), 365), new Date()]);
    const timeseries = extractTimeseries(dataLoggerEquivalencyTable);

    // useDeepCompareEffect(() => {
    //   timeseries.forEach(ts => {
    //     doTimeseriesMeasurementsFetchById({ timeseriesId: ts.timeseriesId, dateRange });
    //   });
    // }, [timeseries, doTimeseriesMeasurementsFetchById, dateRange])

    // console.log('test timeseriesIds: ', timeseries);
    // console.log('test timeseriesMeasurementsItemsObject: ', timeseriesMeasurementsItemsObject);

    return (
      <Card className='mt-3'>
        <Card.Header>
          <Button
            className='text-primary p-0 mr-2'
            variant='link'
            icon={isOpen ? <Remove fontSize='medium' /> : <Add fontSize='medium' /> }
            handleClick={() => setIsOpen(!isOpen)}
            title={isOpen ? 'Collapse Section' : 'Expand Section'}
          />
          <strong>Depth Based Plots</strong>
        </Card.Header>
        <Card.Body>
          {isOpen ? (
            <>
              <div className='row'>
                <div className='col-3'>
                  <label>Field "X"</label>
                  <Select
                    className='d-inline-block w-100'
                    options={generateOptions(timeseries)}
                  />
                </div>
                <div className='col-3'>
                  <label>Field "Y"</label>
                  <Select
                    className='d-inline-block w-100'
                    options={generateOptions(timeseries)}
                  />
                </div>
                <div className='col-3'>
                  <label>Field "Z" (Ele. Change)</label>
                  <Select
                    className='d-inline-block w-100'
                    options={generateOptions(timeseries)}
                  />
                </div>
                <div className='col-3'>
                  <label>Temperature</label>
                  <Select
                    className='d-inline-block w-100'
                    options={generateOptions(timeseries)}
                  />
                </div>
              </div>
            </>
          ) : <i>Expand to view depth plots...</i>}
        </Card.Body>
      </Card>
    );
  },
);

export default DataLoggerDepthPlots;
