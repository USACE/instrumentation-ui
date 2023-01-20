import React, { useState } from 'react';
import {
  useReactTable,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table';

import Icon from '../icon';
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
  const values = filterValues.map(el => el.value.toLowerCase());

  return values.includes(row.getValue(columnId).toLowerCase());
};

const Table = ({
  data,
  columns,
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
      cell: val => !!column.render ? column.render(val?.row?.original) : val.getValue(),
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
    data,
    columns: tableColumns,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <table className={tableClasses}>
      <thead>
        {table.getHeaderGroups().map(headerGroup => (
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
                  asc: <Icon icon='menu-up' />,
                  desc: <Icon icon='menu-down' />,
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
        {table.getRowModel().rows.map(row => (
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
  );
};

export default Table;
