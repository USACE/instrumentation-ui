import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'redux-bundler-react';
import { AgGridReact } from '@ag-grid-community/react';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { Add, Upload } from '@mui/icons-material';

import Button from '../../../app-components/button';
import DateEditor from '../../../app-components/date-editor';
import RoleFilter from '../../../app-components/role-filter';
import TimeseriesForm from './timeseries-form';
import TimeseriesListItem from './timeseries-list-item';

import '../../../css/grids.scss';
import '../instrument.css';

const doesSetHaveData = (dataSet, key, activeTimeseries) => {
  const data = dataSet[activeTimeseries];

  return !!(data && data[key] && data[key].length);
};

// @TODO - check this for runtime
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

const getColumnDefs = (measurements, inclinometerMeasurements, activeTimeseries, updateMeasurement) => {
  const items =
    doesSetHaveData(measurements, 'items', activeTimeseries)
      ? measurements[activeTimeseries].items
      : doesSetHaveData(inclinometerMeasurements, 'inclinometers', activeTimeseries)
        ? getInclinometerItems(inclinometerMeasurements[activeTimeseries].inclinometers)
        : [];

  const keys = items && items.length ? Object.keys(items[0]) : [];
  const columnDefs = [
    {
      headerName: '',
      field: 'rowIndex',
      valueGetter: 'node.rowIndex + 1',
      width: 40,
      headerCheckboxSelection: true,
      checkboxSelection: true,
    },
    ...keys
      .filter(key => key !== 'id')
      .map(key => ({
        headerName: key.toUpperCase(),
        field: key,
        resizable: true,
        sortable: true,
        filter: true,
        editable: true,
        cellEditor: key === 'time' ? 'dateEditor' : undefined,
        onCellValueChanged: cell => updateMeasurement(cell),
      })),
  ];

  return { rowData: items, columnDefs };
};

export default connect(
  'doModalOpen',
  'doInstrumentTimeseriesSetActiveId',
  'doTimeseriesMeasurementsSave',
  'doTimeseriesMeasurementsDelete',
  'doInclinometerMeasurementsDelete',
  'selectProjectsByRoute',
  'selectInstrumentsByRoute',
  'selectNonComputedTimeseriesItemsByRoute',
  'selectTimeseriesMeasurementsItemsObject',
  'selectInclinometerMeasurementsItemsObject',
  ({
    doModalOpen,
    doInstrumentTimeseriesSetActiveId,
    doTimeseriesMeasurementsSave,
    doTimeseriesMeasurementsDelete,
    doInclinometerMeasurementsDelete,
    projectsByRoute: project,
    instrumentsByRoute: instrument,
    nonComputedTimeseriesItemsByRoute: timeseries,
    timeseriesMeasurementsItemsObject: measurements,
    inclinometerMeasurementsItemsObject: inclinometerMeasurements,
  }) => {
    const grid = useRef(null);
    const [activeTimeseries, setActiveTimeseries] = useState(null);
    const [isInclinometer, setIsInclinometer] = useState(false);

    // filter out any timeseries used for constants
    const actualSeries = timeseries.filter((ts) => (
      ts.instrument_id === instrument.id &&
      instrument.constants.indexOf(ts.id) === -1
    ));

    const deleteSelectedRows = () => {
      const nodes = grid?.current?.api?.getSelectedNodes();

      nodes.forEach(node => {
        const { data } = node;
        const { time } = data;

        isInclinometer
          ? doInclinometerMeasurementsDelete({ timeseriesId: activeTimeseries, date: time })
          : doTimeseriesMeasurementsDelete({ timeseriesId: activeTimeseries, date: time });
      });
    };

    const updateMeasurement = cell => {
      const { data, colDef, oldValue } = cell;
      const { field } = colDef;
      const { validated, masked, value } = data;

      const newValue = { ...data };

      if (isInclinometer) {
        // TODO: implement inclinometer measurement saving endpoint.
        // console.info(`Saving measurements ${data}`);
        // doInclinometerMeasurementsSave({
        //   timeseries_id: activeTimeseries,
        //   items: [data],
        // }, null, false, true);
      } else {
        newValue.value = new Number(value);

        if (field === 'time') doTimeseriesMeasurementsDelete({ timeseriesId: activeTimeseries, date: oldValue });
        if (field === 'validated') newValue.validated = validated === true;
        if (field === 'masked') newValue.masked = masked === true;

        doTimeseriesMeasurementsSave({
          timeseries_id: activeTimeseries,
          items: [newValue],
        }, null, false, true);
      }
    };

    const { rowData, columnDefs } = getColumnDefs(measurements, inclinometerMeasurements, activeTimeseries, updateMeasurement);

    useEffect(() => {
      if (activeTimeseries) {
        doInstrumentTimeseriesSetActiveId(activeTimeseries);
        setIsInclinometer(Boolean(doesSetHaveData(inclinometerMeasurements, 'inclinometers', activeTimeseries)));
      }
    }, [activeTimeseries, doInstrumentTimeseriesSetActiveId]);

    return (
      <>
        <p>
          Timeseries are the data associated with an instrument. Often there
          will be a single timeseries that will be plotted directly or in
          combination with constants. However, some instruments may have multiple
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
                icon={<Add fontSize='inherit' sx={{ marginBottom: '2px' }} />}
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
              <RoleFilter allowRoles={[`${project.slug.toUpperCase()}.*`]}>
                <Button
                  variant='secondary'
                  size='small'
                  isOutline
                  isDisabled={!activeTimeseries}
                  href={`/${project.slug}?type=Timeseries Measurement&activeTs=${activeTimeseries}#uploader`}
                  text='Upload to this timeseries'
                  title='Upload'
                  icon={<Upload fontSize='inherit' sx={{ marginBottom: '2px' }} />}
                />
                <Button
                  variant='danger'
                  size='small'
                  isOutline
                  isDisabled={!activeTimeseries}
                  className='ml-2'
                  text='Delete Selected Rows'
                  title='Delete Rows'
                  handleClick={deleteSelectedRows}
                />
              </RoleFilter>
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
                editType='fullRow'
                rowSelection='multiple'
                rowMultiSelectWithClick
                suppressRowClickSelection
                stopEditingWhenCellsLoseFocus
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
