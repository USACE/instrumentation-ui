import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'redux-bundler-react';
import { AgGridReact } from 'ag-grid-react';

import Button from '../../../app-components/button';
import RoleFilter from '../../../app-components/role-filter';
import TimeseriesForm from './timeseries-form';
import TimeseriesListItem from './timeseries-list-item';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-community/dist/styles/ag-theme-balham-dark.css';
import 'ag-grid-community/dist/styles/ag-theme-fresh.css';
import './timeseries.css';

export default connect(
  'doModalOpen',
  'doInstrumentTimeseriesSetActiveId',
  'selectProjectsByRoute',
  'selectInstrumentsByRoute',
  'selectInstrumentTimeseriesItemsByRoute',
  'selectTimeseriesMeasurementsItemsObject',
  ({
    doModalOpen,
    doInstrumentTimeseriesSetActiveId,
    projectsByRoute: project,
    instrumentsByRoute: instrument,
    instrumentTimeseriesItemsByRoute: timeseries,
    timeseriesMeasurementsItemsObject: measurements,
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
      instrument.constants.indexOf(ts.id) === -1
    ));

    const data = measurements[activeTimeseries];
    const items = (data && data.items) || [];

    const keys = items && items.length ? Object.keys(items[0]) : [];
    const columnDefs = [
      { headerName: '', valueGetter: 'node.rowIndex + 1', width: 40 },
      ...keys
        .filter(key => key !== 'id')
        .map(key => ({
          headerName: key.toUpperCase(),
          field: key,
          resizable: true,
          sortable: false,
          filter: true,
          editable: false,
        })),
    ];

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
                icon={<i className='mdi mdi-plus mr-1' />}
              />
            </RoleFilter>
            <ul className='list-group limit-item-list'>
              {actualSeries.map((ts, i) => (
                <TimeseriesListItem
                  key={i}
                  active={activeTimeseries === ts.id}
                  item={ts}
                  onClick={(item) => {
                    setActiveTimeseries(activeTimeseries === ts.id ? null : item.id)
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
                href={`/${project.slug}/upload?type=Timeseries Measurement`}
                text='Upload to this timeseries'
                title='Upload'
                icon={<i className='mdi mdi-upload mr-1' />}
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
                rowData={items}
              />
            </div>
          </div>
        </div>
      </>
    );
  }
);
