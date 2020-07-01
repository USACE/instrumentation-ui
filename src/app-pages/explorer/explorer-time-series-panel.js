import React, { useState, useEffect, useReducer } from "react";
import { connect } from "redux-bundler-react";
import RainfallChart from "./explorer-rainfall-chart";
import TimeSeriesChart from "./explorer-time-series-chart";
import { seriesStyles } from "../../utils";

let styleIterator = 0;

const TimeseriesCheckbox = ({
  timeseries,
  instrument,
  checked = false,
  onChange,
}) => {
  // give each instance of the checkbox a unique ordered index value so
  // we can consistently get the style settings
  const [styleIdx] = useState(styleIterator++);
  const style = seriesStyles[styleIdx % 11];

  return (
    <>
      <label className="checkbox" style={{ paddingLeft: "3.5rem" }}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => {
            onChange({
              [timeseries.id]: {
                name: `${instrument.name} - ${timeseries.name}`,
                active: e.target.checked,
                style: style,
              },
            });
          }}
        />
        {`${timeseries.name} (${timeseries.parameter} in ${timeseries.unit})`}
        {""}
      </label>
      <div
        style={{
          position: "relative",
          right: 0,
          top: "-12px",
          width: "40px",
          borderBottom: `solid ${style.line.width} ${style.line.color}`,
        }}
      />
    </>
  );
};

const InstrumentControl = ({ instrument, timeseries, series, onChange }) => {
  if (!series) return null;
  return (
    <div className="mb-2 ml-2">
      <div className="control">{instrument.name}</div>
      <div>
        {!timeseries
          ? "No timeseries data..."
          : timeseries.map((ts, i) => {
              return (
                <TimeseriesCheckbox
                  key={i}
                  instrument={instrument}
                  checked={series[ts.id] && series[ts.id].active}
                  timeseries={ts}
                  onChange={onChange}
                />
              );
            })}
      </div>
    </div>
  );
};

// using the useReducer hook instead of useState for more complex
// data handling, it's internal to our component, the rest of the
// app doesn't care, so we keep it here instead of moving it to
// a bundle.
const reducer = (series, { type, payload }) => {
  switch (type) {
    case "REPLACE_SERIES":
      return Object.assign({}, payload);
    case "UPDATE_SERIES":
      return Object.assign({}, series, payload);
    default:
      return series;
  }
};

export default connect(
  "doInstrumentTimeseriesSetActiveId",
  "selectTimeseriesMeasurementsItemsObject",
  "selectInstrumentTimeseriesByInstrumentId",
  ({
    doInstrumentTimeseriesSetActiveId,
    instruments,
    version,
    timeseriesMeasurementsItemsObject: measurements,
    instrumentTimeseriesByInstrumentId: timeseriesByInstrumentId,
  }) => {
    const [series, dispatch] = useReducer(reducer, {});

    useEffect(() => {
      if (!series) return undefined;
      Object.keys(series).forEach((key) => {
        if (!measurements.hasOwnProperty(key))
          doInstrumentTimeseriesSetActiveId(key);
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [series, doInstrumentTimeseriesSetActiveId]);

    // if instruments change we want to rebuild the series data,
    // @todo, we should try to do this without
    // losing any of our active state if we don't have to...
    useEffect(() => {
      dispatch({ type: "REPLACE_SERIES", payload: {} });
    }, [version]);

    const chartSeries = {};
    Object.keys(measurements).forEach((id) => {
      if (series.hasOwnProperty(id)) {
        if (series[id].active)
          chartSeries[id] = Object.assign(measurements[id], series[id]);
      }
    });

    return (
      <div className="panel mt-3">
        <div className="panel-block">
          <div className="" style={{ width: "100%" }}>
            {instruments.length ? (
              <div className="columns">
                <div className="column">
                  <div>
                    <RainfallChart />
                  </div>
                  <div className="">
                    <TimeSeriesChart data={chartSeries} />
                  </div>
                </div>
                <div
                  className="column is-one-quarter"
                  style={{ maxHeight: "800px", overflowY: "auto" }}
                >
                  <p className="mb-3">
                    <strong>
                      {`${instruments.length} `}Selected Instruments /
                      Timeseries
                    </strong>
                  </p>
                  <div className="">
                    {/* This is one place we differ from the original implementation for groups, instruments selected by the map are a flat array, not an indexed object... */}
                    {instruments
                      .sort((a, b) => {
                        if (a.name > b.name) return 1;
                        if (a.name < b.name) return -1;
                        return 0;
                      })
                      .map((instrument, i) => {
                        return (
                          <InstrumentControl
                            key={i}
                            instrument={instrument}
                            timeseries={timeseriesByInstrumentId[instrument.id]}
                            series={series}
                            onChange={(e) => {
                              dispatch({
                                type: "UPDATE_SERIES",
                                payload: e,
                              });
                            }}
                          />
                        );
                      })}
                  </div>
                </div>
              </div>
            ) : (
              "Select Instruments from the map to visualize time series"
            )}
          </div>
        </div>
      </div>
    );
  }
);
