import React, { useRef, useEffect } from 'react';
import { AgGridReact } from '@ag-grid-community/react';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';

import '../../../css/grids.scss';

const PreviewTable = ({ columnDefs, data }) => {
  const grid = useRef(null);

  useEffect(() => {
    grid?.current?.api?.refreshCells();
  }, [grid, data]);

  return data?.length ? (
    <div
      className='ag-theme-balham'
      style={{
        height: `${window.innerHeight * 0.70}px`,
        width: '100%',
      }}
    >
      <AgGridReact
        ref={grid}
        rowClassRules={{
          'row-excluded': 'data.exclude',
        }}
        columnDefs={columnDefs}
        rowData={data}
        modules={[ClientSideRowModelModule]}
      />
    </div>
  ) : <p>No Data to show yet</p>;    
};

export default PreviewTable;
