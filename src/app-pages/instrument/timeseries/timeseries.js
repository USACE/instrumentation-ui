import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'redux-bundler-react';
import { AgGridReact } from '@ag-grid-community/react';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';

import Button from '../../../app-components/button';
import Icon from '../../../app-components/icon';
import RoleFilter from '../../../app-components/role-filter';
import TimeseriesForm from './timeseries-form';
import TimeseriesListItem from './timeseries-list-item';

import '../../../css/grids.scss';
import './timeseries.css';

const doesSetHaveData = (dataSet, key, activeTimeseries) => {
  const data = dataSet[activeTimeseries];

  return !!(data && data[key]);
};

const getInclinometerItems = inclinometers => {
  const items = [];

  inclinometers.forEach(inclinometer => {
    const { time, values } = inclinometer;

    values.forEach(value => {
      const { depth, aChecksum, a0, a180, bChecksum, b0, b180 } = value;
      items.push({
        time,
        depth,
        aChecksum,
        a0,
        a180,
        bChecksum,
        b0,
        b180,
      });
    });
  });

  return items;
};

const getColumnDefs = (measurements, inclinometerMeasurements, activeTimeseries) => {
  const items =
    doesSetHaveData(measurements, 'items', activeTimeseries)
      ? measurements[activeTimeseries].items
      : doesSetHaveData(inclinometerMeasurements, 'inclinometers', activeTimeseries)
        ? getInclinometerItems(inclinometerMeasurements[activeTimeseries].inclinometers)
        : [];

  const keys = items && items.length ? Object.keys(items[0]) : [];
  const columnDefs = [
    { headerName: '', valueGetter: 'node.rowIndex + 1', width: 40 },
    ...keys
      .filter(key => key !== 'id')
      .map(key => ({
        headerName: key.toUpperCase(),
        field: key,
        resizable: true,
        sortable: true,
        filter: true,
        editable: true,
      })),
  ];

  return { rowData: items, columnDefs };
};

export default connect(
  'doModalOpen',
  'doInstrumentTimeseriesSetActiveId',
  'selectProjectsByRoute',
  'selectInstrumentsByRoute',
  'selectNonComputedTimeseriesItemsByRoute',
  'selectTimeseriesMeasurementsItemsObject',
  'selectInclinometerMeasurementsItemsObject',
  ({
    doModalOpen,
    doInstrumentTimeseriesSetActiveId,
    projectsByRoute: project,
    instrumentsByRoute: instrument,
    nonComputedTimeseriesItemsByRoute: timeseries,
    timeseriesMeasurementsItemsObject: measurements,
    inclinometerMeasurementsItemsObject: inclinometerMeasurements,
  }) => {
    const grid = useRef(null);
    const [activeTimeseries, setActiveTimeseries] = useState(null);

    // trigger the fetch for our measurements
    useEffect(() => {
      if (activeTimeseries) {
        doInstrumentTimeseriesSetActiveId(activeTimeseries);
      }
    }, [activeTimeseries, doInstrumentTimeseriesSetActiveId]);

    // filter out any timeseries used for constants
    const actualSeries = timeseries.filter((ts) => (
      ts.instrument_id === instrument.id &&
      instrument.constants.indexOf(ts.id) === -1
    ));

    const { rowData, columnDefs } = getColumnDefs(measurements, inclinometerMeasurements, activeTimeseries);

    return (
      <>
        <p>
          Timeseries are the data associated with an instrument. Often there
          will be a single timeseries that will be plotted directly or in
          combination with constants, however some instruments may have multiple
          series of measurements associated with them.
        </p>
        <div className='row'>
          <div className='col-3'>
            <RoleFilter allowRoles={[`${project.slug.toUpperCase()}.*`]}>
              <Button
                isOutline
                size='small'
                variant='success'
                className='mb-2'
                handleClick={() => doModalOpen(TimeseriesForm)}
                text='New Timeseries'
                icon={<Icon icon='plus' className='mr-1' />}
              />
            </RoleFilter>
            <ul className='list-group limit-item-list'>
              {actualSeries.map((ts, i) => (
                <TimeseriesListItem
                  key={i}
                  active={activeTimeseries === ts.id}
                  item={ts}
                  onClick={(item) => {
                    setActiveTimeseries(activeTimeseries === ts.id ? null : item.id);
                  }}
                />
              ))}
            </ul>
          </div>
          <div className='col'>
            <div className='mb-2'>
              <Button
                variant='secondary'
                size='small'
                isOutline
                isDisabled={!activeTimeseries}
                href={`/${project.slug}#uploader`}
                text='Upload to this timeseries'
                title='Upload'
                icon={<Icon icon='upload' className='mr-1' />}
              />
            </div>
            <div
              className='ag-theme-balham'
              style={{
                minHeight: '200px',
                height: '85%',
                width: '100%',
              }}
            >
              <AgGridReact
                ref={grid}
                columnDefs={columnDefs}
                rowData={rowData}
                modules={[ClientSideRowModelModule]}
                editType={'fullRow'}
              />
            </div>
          </div>
        </div>
      </>
    );
  }
);
