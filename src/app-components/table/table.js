import React from 'react';
import {
  useReactTable,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
} from '@tanstack/react-table';

import Icon from '../icon';
import { classArray } from '../../utils';

const columnHelper = createColumnHelper();

const headerClasses = (colDef, customClass = '') => {
  const { enableSorting } = colDef;

  return classArray([
    enableSorting ? 'pointer' : 'default-cursor',
    customClass,
  ]);
};

const Table = ({
  data,
  columns,
}) => {
  const tableColumns = columns.map(column => (
    columnHelper.accessor(column.key, {
      header: () => column.header,
      cell: val => !!column.render ? column.render(val?.row?.original) : val.getValue(),
      enableSorting: !!column.isSortable,
    })
  ));

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <table className='table is-fullwidth'>
      <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th
                key={header.id}
                onClick={header.column.getToggleSortingHandler()}
                className={headerClasses(header.column.columnDef)}
              >
                {header.isPlaceholder ? null : flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
                {{
                  asc: <Icon icon='menu-up' />,
                  desc: <Icon icon='menu-down' />,
                }[header.column.getIsSorted()] ?? null}
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