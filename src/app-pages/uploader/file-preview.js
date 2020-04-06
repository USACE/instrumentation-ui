import React from "react";
import { connect } from "redux-bundler-react";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";

const Empty = () => {
  return <p>Select a file to preview and upload...</p>;
};

export default connect(
  "selectUploadJson",
  "selectUploadHasFile",
  ({ uploadJson, uploadHasFile }) => {
    const renderContents = () => {
      if (!uploadHasFile) return <Empty />;
      if (!uploadJson || !uploadJson.length) return <Empty />;
      const keys = Object.keys(uploadJson[0]);
      const columnDefs = keys.map(key => {
        return {
          headerName: key.toUpperCase(),
          field: key,
          sortable: true,
          filter: true
        };
      });
      const firstFifty = uploadJson.slice(0, 50);
      return (
        <div
          className="ag-theme-balham"
          style={{
            height: `${window.innerHeight * 0.75}px`,
            width: "100%"
          }}
        >
          <AgGridReact
            columnDefs={columnDefs}
            rowData={firstFifty}
          ></AgGridReact>
        </div>
      );
      // return (
      //   <table>
      //     <thead>
      //       <tr>
      //         {keys.map((key, i) => {
      //           return <th key={i}>{key}</th>;
      //         })}
      //       </tr>
      //     </thead>
      //     <tbody>
      //       {firstFifty.map((item, i) => {
      //         return (
      //           <tr key={i}>
      //             {keys.map((key, i2) => {
      //               return (
      //                 <td
      //                   className="overflow-ellipsis"
      //                   title={item[key]}
      //                   key={i2}
      //                 >
      //                   {item[key]}
      //                 </td>
      //               );
      //             })}
      //           </tr>
      //         );
      //       })}
      //     </tbody>
      //   </table>
      // );
    };
    return (
      <div className="panel">
        <p className="panel-heading">Preview (first 50 rows)</p>
        <div className="panel-block">{renderContents()}</div>
      </div>
    );
  }
);
