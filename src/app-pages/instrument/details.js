import React from "react";
import { connect } from "redux-bundler-react";
import Navbar from "../../app-components/navbar";
// import Chart from "../../app-components/chart";
import TimeSeries from "../../app-components/timeSeries";
import InstrumentForm from "../manager/instrument-form";
import Map from "../../app-components/classMap";
import ChartOptions from "./chartOptions";

export default connect(
  "doModalOpen",
  "selectQueryObject",
  "selectPathname",
  "selectInstrumentsByRoute",
  "selectChartType",
  "selectChartLineWidth",
  "selectChartColor",
  "selectInstrumentTimeseriesItems",
  "selectTimeseriesMeasurementsX",
  "selectTimeseriesMeasurementsY",
  "doInstrumentTimeseriesSetActiveId",
  ({
    doModalOpen,
    queryObject: q,
    pathname,
    instrumentsByRoute: instrument,
    chartType,
    chartLineWidth,
    chartColor,
    instrumentTimeseriesItems: timeseries,
    timeseriesMeasurementsX: xData,
    timeseriesMeasurementsY: yData,
    doInstrumentTimeseriesSetActiveId
  }) => {
    if (!instrument) return null;
    const xTest = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const yTest = [13.10, 13.09, 13.10, 13.08, 13.08, 13.07, 13.068, 13.06, 13.065, 13.05]
    console.log(xData, yData)
    return (
      <div>
        <Navbar theme="primary" />
        <section className="container mt-3">
          <div className="columns">
            <div className="column">
              <div className="panel">
                <div
                  className="panel-heading"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {instrument.name}{" "}
                  <button
                    onClick={() => {
                      doModalOpen(InstrumentForm, { item: instrument });
                    }}
                    className="button is-info is-small"
                  >
                    <i className="mdi mdi-pencil pr-2"></i> Edit
                  </button>
                </div>
                <div className="p-3">
                  <div>{instrument.type}</div>
                  <div>{`Height: ${instrument.height}`}</div>
                </div>
              </div>
            </div>
            <div className="column">
              <div className="panel">
                <Map mapKey="instrumentMap" height={300} />
              </div>
            </div>
          </div>
        </section>
        <section className="container mt-3">
          <div className="panel">
            <div className="panel-heading">
              <div className="tabs">
                <ul>
                  <li className={q.t === "s1" ? "is-active" : ""}>
                    <a href={`${pathname}?t=s1`}>Series 1</a>
                  </li>
                  <li className={q.t === "s2" ? "is-active" : ""}>
                    <a href={`${pathname}?t=s2`}>Series 2</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="panel-block">
              <div className="container">
                <div className="tab is-active" style={{ height: "475px" }}>
                  <div className="columns">
                    <div className="column is-one-quarter">
                      <div className="control">
                        {timeseries.map(item => {
                          return (
                            <div className="panel-block">
                              <label className="checkbox">
                                <input type="checkbox" name="timeseries" value={item.id} onClick={() => { doInstrumentTimeseriesSetActiveId(item.id) }} />
                                {item.name}{""}
                              </label>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                    <div className="column">
                      <TimeSeries
                        title={`Data from ${instrument.name} from Jan 1, 2020 to Present`}
                        // data={
                        //   [{ x: xTest, y: yTest, mode: chartType, marker: { color: chartColor }, line: { width: chartLineWidth } }]
                        // }
                        x={xTest}
                        y={yTest}
                      />
                      {q.t === "s2" ? (
                        <TimeSeries title={"Series 2"} x={null} y={null} />
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div >
    );
  }
);
