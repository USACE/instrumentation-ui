import React from "react";
import { connect } from "redux-bundler-react";
import Navbar from "../../app-components/navbar";
// import Chart from "../../app-components/chart";
import TimeSeries from "../../app-components/timeSeries";

export default connect(
  "selectTimeSeriesX",
  "selectTimeSeriesY",
  "selectQueryObject",
  "selectPathname",
  ({ queryObject: q, pathname, timeSeriesX: x, timeSeriesY: y }) => {
    return (
      <div>
        <Navbar theme="primary" />
        <section className="container mt-3">
          <div className="columns">
            <div className="column">
              <div className="panel">
                <div className="panel-heading">Instrument Name</div>
                <div className="panel-block">
                  Lots of good data about the thing
                </div>
              </div>
            </div>
            {/* <div className="column">
              <Chart />
            </div> */}
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
                  <li className={q.t === "s3" ? "is-active" : ""}>
                    <a href={`${pathname}?t=s3`}>Series 3</a>
                  </li>
                  <li className={q.t === "s4" ? "is-active" : ""}>
                    <a href={`${pathname}?t=s4`}>Series 4</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="panel-block">
              <div className="container">
                <div className="tab is-active">
                  {q.t === "s1" ? (
                    <TimeSeries
                      title={"My Very First Time Series Plot"}
                      x={x}
                      y={y}
                    />
                  ) : null}
                  {q.t === "s2" ? (
                    <TimeSeries
                      title={"My Second Time Series Plot"}
                      x={x}
                      y={y}
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
);
