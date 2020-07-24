import React from "react";
import { connect } from "redux-bundler-react";
import DatePicker from "react-datepicker";
import Settings from "./settings";
import VizTimeseries from "./viz-timeseries";
import VizCorrelation from "./viz-correlation";
import { subDays } from "date-fns";

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
          style={{
            position: "absolute",
            top: "-5px",
            left: "5px",
            zIndex: 999,
          }}
          onClick={() => {
            doChartEditorSetShowSettings(!showSettings);
          }}
        >
          <i
            style={{
              fontSize: "1.8em",
              color: showSettings
                ? "rgba(68, 68, 68, 0.6)"
                : "rgba(68, 68, 68, 0.3)",
            }}
            className="mdi mdi-cog"
          ></i>
        </span>
        <div
          className="level"
          style={{
            position: "absolute",
            top: "26px",
            width: "100%",
            zIndex: 9,
            padding: "10px",
          }}
        >
          <div className="level-left">
            <div className="level-item">
              <div className="field">
                <label className="label is-small">Date From</label>
                <div className="control">
                  <DatePicker
                    className="input is-small"
                    selected={from ? new Date(from) : null}
                    onChange={(val) => {
                      updateChartDates(val.toISOString(), to);
                    }}
                    maxDate={to ? new Date(to) : null}
                  />
                </div>
              </div>
            </div>
            <div className="level-item">
              <div className="field">
                <label className="label is-small">Date To</label>
                <div className="control">
                  <DatePicker
                    className="input is-small"
                    selected={to ? new Date(to) : null}
                    onChange={(val) => {
                      updateChartDates(from, val.toISOString());
                    }}
                    minDate={from ? new Date(from) : null}
                  />
                </div>
              </div>
            </div>
            <div className="level-item">
              <div className="field">
                <label className="label is-small">Presets</label>
                <div className="buttons are-small">
                  <button
                    className="button is-small"
                    onClick={() => {
                      const backDate = subDays(now, 30);
                      updateChartDates(
                        backDate.toISOString(),
                        now.toISOString()
                      );
                    }}
                  >
                    30 day
                  </button>
                  <button
                    className="button is-small"
                    onClick={() => {
                      const backDate = subDays(now, 60);
                      updateChartDates(
                        backDate.toISOString(),
                        now.toISOString()
                      );
                    }}
                  >
                    60 day
                  </button>
                  <button
                    className="button is-small"
                    onClick={() => {
                      const backDate = subDays(now, 90);
                      updateChartDates(
                        backDate.toISOString(),
                        now.toISOString()
                      );
                    }}
                  >
                    90 day
                  </button>
                  <button
                    className="button is-small"
                    onClick={() => {
                      setLifetime();
                    }}
                  >
                    Lifetime
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="level-right">
            <div className="level-item"></div>
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
