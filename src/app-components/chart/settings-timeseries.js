import React from "react";
import { connect } from "redux-bundler-react";
// import SeriesPicker from "./series-picker";

export default connect(
  "doChartEditorSetLayout",
  "doChartEditorSetShowToday",
  "doChartEditorSetShowRainfall",
  "selectChartEditorLayout",
  "selectChartEditorShowToday",
  "selectChartEditorShowRainfall",
  ({
    doChartEditorSetLayout,
    doChartEditorSetShowToday,
    doChartEditorSetShowRainfall,
    chartEditorLayout: layout,
    chartEditorShowToday: showToday,
    chartEditorShowRainfall: showRainfall,
  }) => {
    return (
      <div className="columns">
        <div className="column">
          <div>Settings</div>
          <div className="field">
            <label className="label is-small">Y Axis Title</label>
            <p className="control">
              <input
                value={layout.yaxis.title.text}
                onChange={(e) => {
                  doChartEditorSetLayout({
                    ...layout,
                    yaxis: {
                      ...layout.yaxis,
                      ...{ title: { text: e.target.value } },
                    },
                  });
                }}
                className="input is-small"
                type="text"
                placeholder="Y Axis Title"
              />
            </p>
          </div>

          <div className="field">
            <label className="label is-small">X Axis Title</label>
            <p className="control">
              <input
                value={layout.xaxis.title.text}
                onChange={(e) => {
                  doChartEditorSetLayout({
                    ...layout,
                    xaxis: {
                      ...layout.xaxis,
                      ...{ title: { text: e.target.value } },
                    },
                  });
                }}
                className="input is-small"
                type="text"
                placeholder="X Axis Title"
              />
            </p>
          </div>

          <div className="field">
            <p className="control">
              <label className="checkbox  label is-small">
                <input
                  style={{ marginRight: ".8em" }}
                  type="checkbox"
                  checked={showToday}
                  onChange={(e) => {
                    doChartEditorSetShowToday(e.target.checked);
                  }}
                />{" "}
                Show Today on the Chart
              </label>
            </p>
          </div>

          <div className="field">
            <p className="control">
              <label className="checkbox label is-small">
                <input
                  style={{ marginRight: ".8em" }}
                  type="checkbox"
                  checked={showRainfall}
                  onChange={(e) => {
                    doChartEditorSetShowRainfall(e.target.checked);
                  }}
                />{" "}
                Show Rainfall Series
              </label>
            </p>
          </div>
        </div>
        <div className="column"></div>
      </div>
    );
  }
);
