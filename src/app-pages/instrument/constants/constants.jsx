import React, { useState, useEffect } from 'react';
import isEqual from 'lodash.isequal';
import { AgGridReact } from '@ag-grid-community/react';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { connect } from 'redux-bundler-react';
import { Add } from '@mui/icons-material';

import Button from '../../../app-components/button';
import ConstantListItem from './constant-list-item';
import ConstantForm from './constant-form';
import DateEditor from '../../../app-components/date-editor';
import RoleFilter from '../../../app-components/role-filter';
import usePrevious from '../../../customHooks/usePrevious';

import '../../../css/grids.scss';
import '../instrument.css';

const Constants = connect(
  'doModalOpen',
  'doInstrumentTimeseriesSetActiveId',
  'doTimeseriesMeasurementsSave',
  'doUpdateTimeseriesMeasurements',
  'selectProjectsByRoute',
  'selectInstrumentsByRoute',
  'selectInstrumentTimeseriesItemsObject',
  'selectTimeseriesMeasurementsItemsObject',
  ({
    doModalOpen,
    doInstrumentTimeseriesSetActiveId,
    doTimeseriesMeasurementsSave,
    doUpdateTimeseriesMeasurements,
    projectsByRoute: project,
    instrumentsByRoute: instrument,
    instrumentTimeseriesItemsObject: timeseries,
    timeseriesMeasurementsItemsObject: measurements,
  }) => {
    const { constants } = instrument;

    const [activeConstant, setActiveConstant] = useState(null);
    const [, setGridApi] = useState(null);
    const [rowData, setRowData] = useState([]);

    const previousMeasurements = usePrevious(measurements);

    const onGridReady = (params) => {
      setGridApi(params.api);
    };

    const addNewConstant = () => {
      doTimeseriesMeasurementsSave({
        timeseries_id: activeConstant,
        items: [
          ...(rowData || []),
          {
            time: new Date(),
            value: 0,
          }
        ]
      }, null, false, true);
    };

    const updateConstant = cell => {
      const { node, data } = cell;
      const { time, value } = data;
      const workingData = [...rowData];

      workingData.splice(
        node.rowIndex, 1,
        {
          time: new Date(time),
          value: Number(value),
        },
      );

      doUpdateTimeseriesMeasurements({
        timeseries_id: activeConstant,
        items: workingData,
      }, null, false, true);
    };

    /* TODO: Update to DELETE when endpoint is ready */
    // const deleteConstants = () => {
    //   const rowIds = gridApi.getSelectedNodes().map(elem => elem.rowIndex).reverse();
    //   const workingData = [...rowData];

    //   rowIds.forEach(id => {
    //     workingData.splice(id, 1);
    //   });

    //   doTimeseriesMeasurementsSave({
    //     timeseries_id: activeConstant,
    //     items: workingData,
    //   });
    // };

    const columnDefs = [
      ...['time', 'value']
        .map(key => ({
          headerName: key.toUpperCase(),
          field: key,
          resizable: true,
          sortable: false,
          filter: true,
          editable: true,
          cellEditor: key === 'time' ? 'dateEditor' : undefined,
          width: key === 'time' ? 300 : 150,
          // TODO: Add this when DELETE is ready
          // headerCheckboxSelection: key === 'time',
          // checkboxSelection: key === 'time',
          valueFormatter:
            key === 'time'
              ? config => config.value
              : undefined,
          onCellValueChanged: cell => updateConstant(cell),
        })),
    ];

    useEffect(() => {
      if(!isEqual(previousMeasurements, measurements)) {
        setRowData(measurements[activeConstant] ? measurements[activeConstant].items : []);
      }
    }, [measurements]);

    useEffect(() => {
      if (activeConstant) {
        doInstrumentTimeseriesSetActiveId(activeConstant);
        setRowData(measurements[activeConstant] ? measurements[activeConstant].items : []);
      } else {
        setRowData([]);
      }
    }, [activeConstant, doInstrumentTimeseriesSetActiveId]);

    return (
      <div>
        <p>
          Constants are values that you would like to make available to the
          formula editor, constants can be a single value, or a set of values
          valid during distinct time spans.
        </p>
        <div className='row'>
          <div className='col-3'>
            <RoleFilter allowRoles={[`${project.slug.toUpperCase()}.*`]}>
              <Button
                variant='success'
                size='small'
                className='mb-2'
                isOutline
                text='New Constant'
                handleClick={() => doModalOpen(ConstantForm)}
                icon={<Add fontSize='inherit' sx={{ marginBottom: '2px' }} />}
              />
            </RoleFilter>
            <ul className='list-group limit-item-list'>
              {constants.map((id, i) => (
                <ConstantListItem
                  key={i}
                  active={activeConstant === id}
                  item={timeseries[id]}
                  onClick={(itemId) => {
                    if (activeConstant === id) return setActiveConstant(null);
                    setActiveConstant(itemId);
                  }}
                />
              ))}
            </ul>
          </div>
          <div className='col'>
            <div className='mb-2'>
              <RoleFilter allowRoles={[`${project.slug.toUpperCase()}.*`]}>
                <Button
                  variant='success'
                  size='small'
                  isOutline
                  isDisabled={!activeConstant}
                  text='Add Value'
                  handleClick={() => addNewConstant()}
                  icon={<Add fontSize='inherit' sx={{ marginBottom: '2px' }} />}
                />
                {/* TODO: Add when DELETE is ready
                <Button
                  variant='danger'
                  size='small'
                  className='ml-2'
                  isOutline
                  text='Delete Selected'
                  handleClick={() => deleteConstants()}
                /> */}
              </RoleFilter>
            </div>
            <div
              className='ag-theme-balham'
              style={{
                height: '210px',
                width: '100%',
              }}
            >
              <AgGridReact
                onGridReady={onGridReady}
                columnDefs={columnDefs}
                rowData={rowData}
                rowSelection={'multiple'}
                stopEditingWhenGridLosesFocus={true}
                modules={[ClientSideRowModelModule]}
                frameworkComponents={{
                  dateEditor: DateEditor,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default Constants;
