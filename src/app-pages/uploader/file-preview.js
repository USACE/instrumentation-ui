import React, { useEffect } from "react";
import { connect } from "redux-bundler-react";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import "ag-grid-community/dist/styles/ag-theme-balham-dark.css";
import "ag-grid-community/dist/styles/ag-theme-fresh.css";

const Empty = () => {
  return <p>Select a file to preview and upload...</p>;
};

export default connect(
  "selectUploadJson",
  "selectUploadHasFile",
  "selectUploadIgnoreRowsList",
  ({ uploadJson, uploadHasFile, uploadIgnoreRowsList }) => {
    let grid, columnDefs, firstFifty;
    if (uploadJson && uploadJson.length && uploadHasFile) {
      const keys = Object.keys(uploadJson[0]);
      columnDefs = [
        { headerName: "", valueGetter: "node.rowIndex + 1", width: 40 },
        ...keys.map((key) => {
          return {
            headerName: key.toUpperCase(),
            field: key,
            resizable: true,
            sortable: true,
            filter: true,
            editable: true,
          };
        }),
      ];
      firstFifty = uploadJson.slice(0, 50).map((row, i) => {
        row.exclude = false;
        return row;
      });
    }
    useEffect(() => {
      if (!grid) return undefined;
      grid.api.forEachNode(function (rowNode) {
        rowNode.setDataValue(
          "exclude",
          uploadIgnoreRowsList.indexOf(rowNode.rowIndex + 1) !== -1
        );
      });
    }, [grid, uploadIgnoreRowsList]);
    const previewMessage =
      uploadJson && uploadJson.length
        ? `Preview (first 50 rows of ${uploadJson.length})`
        : "Preview (first 50 rows)";
    return (
      <div className="panel">
        <p className="panel-heading">{previewMessage}</p>
        <div className="panel-block">
          {uploadHasFile && uploadJson && uploadJson.length ? (
            <div
              className="ag-theme-balham"
              style={{
                height: `${window.innerHeight * 0.75}px`,
                width: "100%",
              }}
            >
              <AgGridReact
                ref={(el) => {
                  grid = el;
                }}
                rowClassRules={{
                  "row-excluded": "data.exclude",
                }}
                columnDefs={columnDefs}
                rowData={firstFifty}
                enableCellChangeFlash={true}
              ></AgGridReact>
            </div>
          ) : (
            <Empty />
          )}
        </div>
      </div>
    );
  }
);
