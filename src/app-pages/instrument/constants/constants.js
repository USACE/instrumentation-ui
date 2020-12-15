import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'redux-bundler-react';
import { AgGridReact } from 'ag-grid-react';
import { format } from 'date-fns';
import ConstantListItem from './constant-list-item';
import ConstantForm from './constant-form';
import RoleFilter from '../../../app-components/role-filter';
import DateEditor from './date-editor';
import 'react-datepicker/dist/react-datepicker.css';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-community/dist/styles/ag-theme-balham-dark.css';
import 'ag-grid-community/dist/styles/ag-theme-fresh.css';

export default connect(
  'selectProjectsByRoute',
  'selectInstrumentsByRoute',
  'selectInstrumentTimeseriesItemsObject',
  'selectTimeseriesMeasurementsItemsObject',
  'doModalOpen',
  'doInstrumentTimeseriesSetActiveId',
  ({
    projectsByRoute: project,
    instrumentsByRoute: instrument,
    instrumentTimeseriesItemsObject: timeseries,
    timeseriesMeasurementsItemsObject: measurements,
    doModalOpen,
    doInstrumentTimeseriesSetActiveId,
  }) => {
    const grid = useRef(null);

    const { constants } = instrument;
    const [activeConstant, setActiveConstant] = useState(null);

    // trigger the fetch for our measurements
    useEffect(() => {
      if (!activeConstant) return undefined;
      doInstrumentTimeseriesSetActiveId(activeConstant);
    }, [activeConstant, doInstrumentTimeseriesSetActiveId]);

    const data = measurements[activeConstant];
    const [items, setItems] = useState((data && data.items) || []);

    const keys = items && items.length ? Object.keys(items[0]) : [];
    const columnDefs = [
      { headerName: '', valueGetter: 'node.rowIndex + 1', width: 40 },
      ...keys
        .filter((key) => {
          return key !== 'id';
        })
        .map((key) => {
          return {
            headerName: key.toUpperCase(),
            field: key,
            resizable: true,
            sortable: false,
            filter: true,
            editable: true,
            cellEditor: key === 'time' ? 'dateEditor' : undefined,
            valueFormatter:
              key === 'time'
                ? (config) => {
                  const d = new Date(config.value);
                  return format(d, 'MMMM d, yyyy h:mm aa zzzz');
                }
                : undefined,
            onCellValueChanged: (e) => {
              console.log(e);
            },
          };
        }),
    ];

    const addNew = () => {
      const newArr = [
        ...items,
        {
          time: new Date(),
          value: 0,
        },
      ];
      setItems(newArr);
    };

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
              <button
                className='btn btn-sm btn-outline-success mb-2'
                onClick={() => {
                  doModalOpen(ConstantForm);
                }}
                title='New Constant'
              >
                <i className='mdi mdi-plus mr-1'></i>New Constant
              </button>
            </RoleFilter>
            <ul className='list-group'>
              {constants.map((id, i) => {
                return (
                  <ConstantListItem
                    key={i}
                    active={activeConstant === id}
                    item={timeseries[id]}
                    onClick={(item) => {
                      if (activeConstant === id) return setActiveConstant(null);
                      setActiveConstant(item.id);
                    }}
                  />
                );
              })}
            </ul>
          </div>
          <div className='col'>
            <div className='mb-2'>
              <RoleFilter allowRoles={[`${project.slug.toUpperCase()}.*`]}>
                <button
                  disabled={!activeConstant}
                  className='btn btn-sm btn-outline-secondary'
                  onClick={addNew}
                  title='Add Value'
                >
                  <i className='mdi mdi-plus mr-1'></i>Add Value
                </button>
              </RoleFilter>
            </div>
            <div
              className='ag-theme-balham'
              style={{
                height: `200px`,
                width: '100%',
              }}
            >
              <AgGridReact
                ref={grid}
                columnDefs={columnDefs}
                rowData={items}
                stopEditingWhenGridLosesFocus={true}
                frameworkComponents={{
                  dateEditor: DateEditor,
                }}
              ></AgGridReact>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
