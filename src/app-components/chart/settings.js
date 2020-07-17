import React from "react";
import { connect } from "redux-bundler-react";
import SettingsTimeseries from "./settings-timeseries";
import SettingsCorrelation from "./settings-correlation";

export default connect(
  "doChartEditorSetChartType",
  "doChartEditorSetLayout",
  "selectChartEditorChartType",
  "selectChartEditorLayout",
  ({
    doChartEditorSetChartType,
    doChartEditorSetLayout,
    chartEditorChartType: chartType,
    chartEditorLayout: layout,
  }) => {
    return (
      <div style={{ marginTop: "6em", padding: "10px" }}>
        <div className="mb-2">
          <div className="columns">
            <div className="column">
              <div className="field">
                <label className="label is-small">Chart Type</label>
                <div className="control">
                  <div className="select is-small" style={{ width: "100%" }}>
                    <select
                      style={{ width: "100%" }}
                      value={chartType}
                      onChange={(e) => {
                        doChartEditorSetChartType(e.target.value);
                        doChartEditorSetLayout({
                          ...layout,
                          xaxis: {
                            ...layout.xaxis,
                            ...{
                              type:
                                e.target.value === "timeseries" ? "date" : "-",
                            },
                          },
                        });
                      }}
                    >
                      <option value="timeseries">Timeseries</option>
                      <option value="correlation">Correlation Plot</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="column">
              <div className="field">
                <label className="label is-small">Chart Title</label>
                <p className="control">
                  <input
                    value={layout.title.text}
                    onChange={(e) => {
                      doChartEditorSetLayout({
                        ...layout,
                        title: {
                          ...layout.title,
                          ...{ text: e.target.value },
                        },
                      });
                    }}
                    className="input is-small"
                    type="text"
                    placeholder="Title"
                  />
                </p>
              </div>
            </div>
          </div>
        </div>
        {chartType === "timeseries" ? (
          <SettingsTimeseries />
        ) : (
          <SettingsCorrelation />
        )}
      </div>
    );
  }
);
