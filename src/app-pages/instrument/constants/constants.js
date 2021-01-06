import React, { useRef, useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { connect } from 'redux-bundler-react';
import { format } from 'date-fns';

import Button from '../../../app-components/button';
import ConstantListItem from './constant-list-item';
import ConstantForm from './constant-form';
import DateEditor from './date-editor';
import RoleFilter from '../../../app-components/role-filter';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-community/dist/styles/ag-theme-balham-dark.css';
import 'ag-grid-community/dist/styles/ag-theme-fresh.css';
import 'react-datepicker/dist/react-datepicker.css';

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
      if (activeConstant) {
        doInstrumentTimeseriesSetActiveId(activeConstant);
      }
    }, [activeConstant, doInstrumentTimeseriesSetActiveId]);

    const data = measurements[activeConstant];
    const [items, setItems] = useState((data && data.items) || []);

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
          })),
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
              <Button
                variant='success'
                size='small'
                className='mb-2'
                isOutline
                text='New Constant'
                handleClick={() => doModalOpen(ConstantForm)}
                icon={<i className='mdi mdi-plus mr-1' />}
              />
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
                <Button
                  variant='secondary'
                  size='small'
                  isOutline
                  isDisabled={!activeConstant}
                  text='Add Value'
                  handleClick={addNew}
                  icon={<i className='mdi mdi-plus mr-1' />}
                />
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
