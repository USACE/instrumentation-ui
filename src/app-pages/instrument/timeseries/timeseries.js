import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'redux-bundler-react';
import DatePicker from 'react-datepicker';
import { AgGridReact } from '@ag-grid-community/react';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { CSVLink } from 'react-csv';

import Button from '../../../app-components/button';
import Icon from '../../../app-components/icon';
import RoleFilter from '../../../app-components/role-filter';
import DateEditor from '../../../app-components/date-editor';
import TimeseriesForm from './timeseries-form';
import TimeseriesListItem from './timeseries-list-item';

import '../../../css/grids.scss';
import './timeseries.css';
import { isObjectLike } from 'lodash';

export default connect(
  'doModalOpen',
  'doInstrumentTimeseriesSetActiveId',
  'selectProjectsByRoute',
  'selectInstrumentsByRoute',
  'selectNonComputedTimeseriesItemsByRoute',
  'selectTimeseriesMeasurementsItemsObject',
  'selectInclinometerMeasurementsItemsObject',
  'doDeleteTimeseriesMeasurement',
  'doTimeseriesMeasurementsSave',
  'doDeleteInclinometerMeasurement',
  ({
    doModalOpen,
    doDeleteTimeseriesMeasurement,
    doDeleteInclinometerMeasurement,
    doTimeseriesMeasurementsSave,
    doInstrumentTimeseriesSetActiveId,
    projectsByRoute: project,
    instrumentsByRoute: instrument,
    nonComputedTimeseriesItemsByRoute: timeseries,
    timeseriesMeasurementsItemsObject: measurements,
    inclinometerMeasurementsItemsObject: inclinometerMeasurements,
  }) => {
    const [grid, setGrid] = useState(null);
    const [activeTimeseries, setActiveTimeseries] = useState(null);
    const [activeTimeseriesName, setActiveTimeseriesName] = useState(null);
    const [didDelete, setDidDelete] = useState(false);
    const [isInclinometer, setIsInclinometer] = useState(null);
    const [isUsingDateRange, setIsUsingDateRange] = useState(false);
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;

    // trigger the fetch for our measurements
    useEffect(() => {
      if (activeTimeseries) {
        doInstrumentTimeseriesSetActiveId(activeTimeseries);
      }
      doesSetHaveData(inclinometerMeasurements, 'inclinometers', activeTimeseries) ? setIsInclinometer(true) : setIsInclinometer(false);
    }, [activeTimeseries, didDelete, doInstrumentTimeseriesSetActiveId, dateRange]);

    const doesSetHaveData = (dataSet, key, activeTimeseries) => {
      const data = dataSet[activeTimeseries];
      
      return !!(data && data[key]);
    };

    // filter out any timeseries used for constants
    const actualSeries = timeseries.filter((ts) => (
      ts.instrument_id === instrument.id &&
      instrument.constants.indexOf(ts.id) === -1
    ));

    const onGridReady = (params) => {
      setGrid(params);
    };

    const deleteMeasurement = () => {
      if (grid.api.getSelectedNodes()[0]) {
        const rowData = grid.api.getSelectedNodes()[0].data;
        const time = rowData.time;
        isInclinometer ? 
          doDeleteInclinometerMeasurement({
            timeseriesId: activeTimeseries,
            date: time
          }) :
          doDeleteTimeseriesMeasurement({
            timeseriesId: activeTimeseries,
            date: time
          });
        setDidDelete(!didDelete);
      }
    };

    const updateMeasurement = cell => {

      if(isInclinometer) {
        // TO DO : create doInclinometerMeasurementsSave()
      } else {
        const { node, data } = cell;
        data.value = new Number(data.value);
        if(cell.colDef.field == 'time') {
          doDeleteTimeseriesMeasurement({
            timeseriesId: activeTimeseries,
            date: cell.oldValue
          });
        }
        if(cell.colDef.field == 'validated') {
          data.validated = data.validated == 'true' ? true : false;
        } else if(cell.colDef.field == 'masked') {
          data.masked = data.masked == 'true' ? true : false;
        }
        doTimeseriesMeasurementsSave({
          timeseries_id: activeTimeseries,
          items: [data],
        }, null, false, true);
      }
      
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
            editable: !isInclinometer ? true : false, // no editing inclinometer values for now
            cellEditor: key === 'time' ? 'dateEditor' : undefined,
            onCellValueChanged: cell => updateMeasurement(cell),
          })),
      ];
      
      const filteredItems = isUsingDateRange ? items.filter(item => new Date(item['time']) >= startDate && new Date(item['time']) <= endDate) : items;

      return { rowData: filteredItems, columnDefs };
    };

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
                    setActiveTimeseriesName(activeTimeseries === ts.id ? null : ts.name);
                  }}
                />
              ))}
            </ul>
          </div>
          <div className='col'>
            <div className='mb-2'>
              <RoleFilter allowRoles={[`${project.slug.toUpperCase()}.*`]}>
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
              </RoleFilter>
              <RoleFilter allowRoles={[`${project.slug.toUpperCase()}.*`]}>
                <CSVLink data={rowData} filename={instrument.name+' - '+activeTimeseriesName+'.csv'}>
                  <Button
                    variant='secondary'
                    size='small'
                    isOutline
                    className='ml-2'
                    isDisabled={!activeTimeseries}
                    text='Download measurements'
                    icon={<Icon icon='download' classname='mr-1'/>}
                  />
                </CSVLink>
              </RoleFilter>
              <RoleFilter allowRoles={[`${project.slug.toUpperCase()}.*`]}>
                <Button
                  variant='danger'
                  size='small'
                  className='ml-2'
                  isOutline
                  text='Delete Selected Measurement'
                  isDisabled={!activeTimeseries}
                  handleClick={() => deleteMeasurement()}
                />
              </RoleFilter>
              <Button
                variant='primary'
                size='small'
                className='ml-2'
                isOutline
                text='Toggle DateRange'
                isDisabled={!activeTimeseries || !rowData.length}
                handleClick={()=>{
                  !isUsingDateRange ? 
                    setDateRange([new Date(rowData[rowData.length-1]['time']), new Date(rowData[0]['time'])]) :
                    setDateRange([null, null]);
                  setIsUsingDateRange(!isUsingDateRange);
                }}
              />
              <DatePicker
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => {
                  setDateRange(update);
                }}
                disabled={!isUsingDateRange}
                showMonthDropdown
                showYearDropdown
                dateFormat='MMMM d, yyyy h:mm aa zzzz'
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
                onGridReady={onGridReady}
                columnDefs={columnDefs}
                rowData={rowData}
                rowSelection={'single'}
                stopEditingWhenGridLosesFocus={true}
                modules={[ClientSideRowModelModule]}
                frameworkComponents={{
                  'dateEditor': DateEditor,
                }}
              />
            </div>
          </div>
        </div>
      </>
    );
  }
);
