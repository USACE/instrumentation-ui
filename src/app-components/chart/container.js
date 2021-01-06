import React from "react";
import DatePicker from "react-datepicker";
import { connect } from "redux-bundler-react";
import { subDays } from "date-fns";

import Button from '../button';
import Settings from "./settings";
import VizTimeseries from "./viz-timeseries";
import VizCorrelation from "./viz-correlation";

export default connect(
  "doChartEditorSetShowSettings",
  "doChartEditorSetLayout",
  "doChartEditorSetCorrelationDates",
  "selectChartEditorShowSettings",
  "selectChartEditorChartType",
  "selectChartEditorLayout",
  "selectChartEditorCorrelationMinDate",
  "selectChartEditorCorrelationMaxDate",
  ({
    doChartEditorSetShowSettings,
    doChartEditorSetLayout,
    doChartEditorSetCorrelationDates,
    chartEditorShowSettings: showSettings,
    chartEditorChartType: chartType,
    chartEditorLayout: layout,
    chartEditorCorrelationMinDate: minDate,
    chartEditorCorrelationMaxDate: maxDate,
  }) => {
    const now = new Date();
    const from =
      chartType === "timeseries"
        ? layout.xaxis.range[0]
          ? layout.xaxis.range[0]
          : null
        : minDate;
    const to =
      chartType === "timeseries"
        ? layout.xaxis.range[1]
          ? layout.xaxis.range[1]
          : null
        : maxDate;

    const updateChartDates = (f, t) => {
      if (chartType === "timeseries") {
        doChartEditorSetLayout({
          ...layout,
          xaxis: {
            ...layout.xaxis,
            ...{ autorange: false, range: [f, t] },
          },
        });
      } else {
        doChartEditorSetCorrelationDates(f, t);
      }
    };

    // @TODO trying to set initial dates to last 60 days, not sure what
    // to key off of for this...
    // useEffect(() => {
    //   console.log("*************", from, to);
    //   if (chartType === "timeseries" && from === null && to === null) {
    //     console.log("setting dates");
    //     updateChartDates(subDays(now, 60), now);
    //   }
    //   // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [chartType, from, to]);

    const setLifetime = () => {
      if (chartType === "timeseries") {
        doChartEditorSetLayout({
          ...layout,
          xaxis: {
            ...layout.xaxis,
            ...{ autorange: true },
          },
        });
      } else {
        doChartEditorSetCorrelationDates(null, null);
      }
    };

    return (
      <div style={{ height: "100%" }}>
        <span
          className="pointer"
          style={{
            position: "absolute",
            top: "0px",
            left: "5px",
            zIndex: 999,
          }}
          onClick={() => {
            doChartEditorSetShowSettings(!showSettings);
          }}
        >
          <i
            style={{
              fontSize: "1.5em",
              color: showSettings
                ? "rgba(68, 68, 68, 0.6)"
                : "rgba(68, 68, 68, 0.3)",
            }}
            className="mdi mdi-cog"
          ></i>
        </span>
        <div
          className="d-flex"
          style={{
            position: "absolute",
            top: "26px",
            width: "100%",
            zIndex: 9,
            padding: "10px",
          }}
        >
          <div className="form-group mr-2">
            <label>
              <small>Date From</small>
            </label>
            <div>
              <DatePicker
                className="form-control form-control-sm"
                selected={from ? new Date(from) : null}
                onChange={(val) => {
                  updateChartDates(val.toISOString(), to);
                }}
                maxDate={to ? new Date(to) : null}
              />
            </div>
          </div>
          <div className="form-group mr-2">
            <label>
              <small>Date To</small>
            </label>
            <div>
              <DatePicker
                className="form-control form-control-sm"
                selected={to ? new Date(to) : null}
                onChange={(val) => {
                  updateChartDates(from, val.toISOString());
                }}
                minDate={from ? new Date(from) : null}
              />
            </div>
          </div>
          <div className="form-group">
            <label>
              <small>Presets</small>
            </label>
            <div>
              <div className="btn-group">
                <Button
                  variant='info'
                  size='small'
                  isOutline
                  text='30 day'
                  handleClick={() => {
                    const backDate = subDays(now, 30);
                    updateChartDates(backDate.toISOString(), now.toISOString());
                  }}
                />
                <Button
                  variant='info'
                  size='small'
                  isOutline
                  text='60 day'
                  handleClick={() => {
                    const backDate = subDays(now, 60);
                    updateChartDates(backDate.toISOString(), now.toISOString());
                  }}
                />
                <Button
                  variant='info'
                  size='small'
                  isOutline
                  text='90 day'
                  handleClick={() => {
                    const backDate = subDays(now, 90);
                    updateChartDates(backDate.toISOString(), now.toISOString());
                  }}
                />
                <Button
                  variant='info'
                  size='small'
                  isOutline
                  text='Lifetime'
                  handleClick={() => setLifetime()}
                />
              </div>
            </div>
          </div>
        </div>
        {showSettings ? (
          <Settings />
        ) : chartType === "timeseries" ? (
          <VizTimeseries />
        ) : (
          <VizCorrelation />
        )}
      </div>
    );
  }
);
