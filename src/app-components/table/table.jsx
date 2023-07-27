import React, { useState } from 'react';
import Select from 'react-select';
import {
  useReactTable,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table';
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';

import Button from '../button';
import Filter from './filter';
import { classArray } from '../../common/helpers/utils';

const columnHelper = createColumnHelper();

const headerClasses = colDef => {
  const { enableSorting, isRightAlign } = colDef;

  return classArray([
    'no-select',
    enableSorting ? 'pointer' : 'default-cursor',
    isRightAlign ? 'text-right' : '',
  ]);
};

const multiFilterFn = (row, columnId, filterValues) => {
  if (!filterValues.length) return true;
  
  const values = filterValues.map(el => el.value.toLowerCase());

  return values.includes(row.getValue(columnId).toLowerCase());
};

const Table = ({
  data,
  columns,
  usePagination = false,
  className,
}) => {
  const [columnFilters, setColumnFilters] = useState([]);
  const tableClasses = classArray([
    'table',
    'is-fullwidth',
    className,
  ]);

  const tableColumns = columns.map(column => (
    columnHelper.accessor(column.key, {
      ...column,
      header: () => column.header,
      cell: val => column.render ? column.render(val?.row?.original) : val.getValue(),
      enableSorting: !!column.isSortable,
      enableColumnFilter: !!column.isFilterable,
    })
  ));

  const table = useReactTable({
    state: {
      columnFilters,
    },
    filterFns: {
      multi: multiFilterFn,
    },
    data: data || [],
    columns: tableColumns || [],
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    ...usePagination && ({
      getPaginationRowModel: getPaginationRowModel(),
    }),
  });

  const currentIndex = table.getState().pagination.pageIndex;

  return (
    <>
      <table className={tableClasses}>
        <thead>
          {table.getHeaderGroups()?.map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className={headerClasses(header.column.columnDef)}
                >
                  <span onClick={header.column.getToggleSortingHandler()}>
                    {header.isPlaceholder ? null : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </span>
                  {{
                    asc: <ArrowDropUp fontSize='small' />,
                    desc: <ArrowDropDown fontSize='small' />,
                  }[header.column.getIsSorted()] ?? null}
                  {header.column.getCanFilter() ? (
                    <Filter column={header.column} />
                  ) : null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel()?.rows?.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {usePagination ? (
          <div className='row mt-2 no-gutters border-top pt-3'>
            <div className='col-12'>
              <Button
                isOutline
                size='small'
                variant='info'
                text='First'
                className='d-inline-block mr-1'
                handleClick={() => table.setPageIndex(0)}
                isDisabled={currentIndex === 0}
              />
              <Button
                isOutline
                size='small'
                variant='info'
                text='Prev'
                className='d-inline-block mr-1'
                handleClick={() => table.previousPage()}
                isDisabled={currentIndex === 0}
              />
              <span>
                Page <b>{table.getState().pagination.pageIndex + 1}</b> of <b>{table.getPageCount()}</b>
              </span>
              <Button
                isOutline
                size='small'
                variant='info'
                text='Next'
                className='d-inline-block mx-1'
                handleClick={() => table.nextPage()}
                isDisabled={currentIndex === (table.getPageCount() - 1)}
              />
              <Button
                isOutline
                size='small'
                variant='info'
                text='Last'
                className='d-inline-block mr-1'
                handleClick={() => table.setPageIndex(table.getPageCount() - 1)}
                isDisabled={currentIndex === (table.getPageCount() - 1)}
              />
              <div className='d-inline-block float-right'>
                <i className='mr-1'>
                  Items per page:
                </i>
                <Select
                  className='d-inline-block'
                  defaultValue={{ label: '10', value: 10 }}
                  onChange={option => table.setPageSize(option.value)}
                  options={[
                    { label: '10', value: 10 },
                    { label: '20', value: 20 },
                    { label: '30', value: 30 },
                  ]}
                />
              </div>
            </div>
          </div>
        ) : null}
    </>
  );
};

export default Table;
