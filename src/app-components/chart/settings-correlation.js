import React from "react";
import { connect } from "redux-bundler-react";

export default connect(
  "doChartEditorSetLayout",
  "doChartEditorSetExactMatchesOnly",
  "doChartEditorSetCorrelationSeriesX",
  "doChartEditorSetCorrelationSeriesY",
  "selectChartEditorLayout",
  "selectChartEditorExactMatchesOnly",
  "selectChartEditorCorrelationSeriesX",
  "selectChartEditorCorrelationSeriesY",
  "selectExploreDataByInstrumentId",
  ({
    doChartEditorSetLayout,
    doChartEditorSetExactMatchesOnly,
    doChartEditorSetCorrelationSeriesX,
    doChartEditorSetCorrelationSeriesY,
    chartEditorLayout: layout,
    chartEditorExactMatchesOnly: exactMatchesOnly,
    chartEditorCorrelationSeriesX: correlationSeriesX,
    chartEditorCorrelationSeriesY: correlationSeriesY,
    exploreDataByInstrumentId,
  }) => {
    const timeseriesOptions = [];
    Object.keys(exploreDataByInstrumentId).forEach((instrumentId) => {
      const instrument = exploreDataByInstrumentId[instrumentId];
      instrument.timeseries.forEach((timeseries) => {
        timeseriesOptions.push({
          key: timeseries.id,
          title: `${timeseries.instrument} - ${timeseries.name}`,
          value: timeseries.id,
        });
      });
    });

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
              <label className="checkbox label is-small">
                <input
                  style={{ marginRight: ".8em" }}
                  type="checkbox"
                  checked={exactMatchesOnly}
                  onChange={(e) => {
                    doChartEditorSetExactMatchesOnly(e.target.checked);
                  }}
                />{" "}
                Limit to exact temporal matches
              </label>
            </p>
          </div>
        </div>
        <div className="column">
          <div>Series</div>

          <div className="field">
            <label className="label is-small">Y Series</label>
            <div className="control">
              <div className="select is-small">
                <select
                  value={correlationSeriesY}
                  onChange={(e) => {
                    doChartEditorSetCorrelationSeriesY(e.target.value);
                    const title = e.target.selectedOptions[0].dataset.title;
                    doChartEditorSetLayout({
                      ...layout,
                      yaxis: {
                        ...layout.yaxis,
                        ...{ title: { text: title } },
                      },
                    });
                  }}
                >
                  <option value="">Please Choose a Dataset...</option>
                  {timeseriesOptions.map((opt) => {
                    return (
                      <option
                        key={opt.key}
                        data-title={opt.title}
                        value={opt.value}
                      >
                        {opt.title}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>

          <div className="field">
            <label className="label is-small">X Series</label>
            <div className="control">
              <div className="select is-small">
                <select
                  value={correlationSeriesX}
                  onChange={(e) => {
                    doChartEditorSetCorrelationSeriesX(e.target.value);
                    const title = e.target.selectedOptions[0].dataset.title;
                    doChartEditorSetLayout({
                      ...layout,
                      xaxis: {
                        ...layout.xaxis,
                        ...{ title: { text: title } },
                      },
                    });
                  }}
                >
                  <option value="">Please Choose a Dataset...</option>
                  {timeseriesOptions.map((opt) => {
                    return (
                      <option
                        key={opt.key}
                        data-title={opt.title}
                        value={opt.value}
                      >
                        {opt.title}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
