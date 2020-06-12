import React, { useEffect, useState } from "react";
import { connect } from "redux-bundler-react";
import Navbar from "../../app-components/navbar";
// import Chart from "../../app-components/chart";
import TimeSeries from "../../app-components/timeSeries";
import InstrumentForm from "../manager/instrument-form";
import Map from "../../app-components/classMap";
// import ChartOptions from "./chartOptions";

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
  "selectTimeseriesMeasurementsItemsObject",
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
    timeseriesMeasurementsItemsObject: objectList,
    doInstrumentTimeseriesSetActiveId
  }) => {

    // useEffect(() => {
    // Object.values(timeseries).forEach(i => {
    // if (i.hasOwnProperty('status')) {
    //   return null
    // } else {
    //   i.status = "no"
    // }
    //   })
    // })
    // const renderData = (data) => {
    //   let array = Object.values(timeseries)
    //   let list = Object.values(data)
    //   let yes = array.filter(i => i.status === "yes")
    //   let datatry = [];
    //   for (let i in yes) {
    //     let chosen = (yes[i].id)
    //     for (let i in list) {
    //       if (chosen === list[i].timeseries_id) {
    //         datatry.push(list[i])
    //       }
    //     }
    //     // ids.push(array[i].id)
    //   }
    //   let dataList = [];
    //   // if i could add a status to objectlist and select the objects where status is yes
    //   // then this would work
    //   // Object.values(data).forEach((key) => {
    //   datatry.forEach((key) => {
    //     let time = []
    //     let value = []
    //     // returns single object of items
    //     let item = key.items;
    //     item.map(x => {
    //       time.push(x.time)
    //       value.push(x.value)
    //     })
    //     dataList.push({ x: time, y: value })
    //   })
    //   return dataList
    // }
    // const changeStatus = (id) => {
    //   let array = Object.values(timeseries)
    //   for (let i in array) {
    //     if (array[i].id === id) {
    //       if (array[i].status === 'no') {
    //         array[i].status = 'yes'
    //       } else {
    //         array[i].status = 'no'
    //       }
    //     }
    //   }
    // }

    // const handleClick = (id, key) => {
    //   changeStatus(id)
    //   doInstrumentTimeseriesSetActiveId(id);
    // }
    useEffect(() => {
      if (!timeseries || !timeseries.length) return undefined;
      let firstTimeseries = timeseries[0]
      if (firstTimeseries && firstTimeseries.id) {
        doInstrumentTimeseriesSetActiveId(firstTimeseries.id)
        chartData(firstTimeseries.id)
      }
    }, [timeseries.length])
    const [f, setTab] = useState(0)
    // const pretendData = [
    //   { x: [1, 2, 3], y: [2, 1, 3] },
    //   { x: [1, 2, 3], y: [3, 2, 2] },
    //   { x: [1, 2, 3], y: [1, 1, 2] },
    //   { x: [1, 2, 3], y: [2, 3, 1] },
    // ]
    const handleTab = (id, key) => {
      doInstrumentTimeseriesSetActiveId(id)
      setTab(key)
      chartData(id)
    }
    const chartData = (id) => {
      let dataList = {};
      Object.values(objectList).forEach((key) => {
        let time = []
        let value = []
        // returns single object of items
        let item = key.items;
        item.map(x => {
          time.push(x.time)
          value.push(x.value)
        })
        dataList[key.timeseries_id] = { x: time, y: value }
      })
      return [(dataList[id])]
      // if i can access the dictionary outside of this function, i can grab it in the data part of the timeseries
    }
    if (!instrument) return null;
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
                {timeseries.map((item, key) => {
                  return (
                    <div>
                      <ul>
                        <li className={f === key ? "is-active" : ""} >
                          <a onClick={() => handleTab(item.id, key)}>{item.name}</a>
                        </li>
                      </ul>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="panel-block">
              <div className="container">
                <div className="tab is-active" style={{ height: "475px" }}>
                  <div className="columns">
                    {/* <div className="column is-one-quarter">
                      <div className="control">
                        {timeseries.map((item, key) => {
                          return (
                            <div className="panel-block">
                              <label className="checkbox">
                                <input type="checkbox" name="timeseries" id={key} value={item.id} onClick={() => handleClick(item.id)} />
                                {item.name}{""}
                              </label>
                            </div>
                          )
                        })}
                      </div>
                    </div> */}
                    <div className="column">
                      {timeseries.map((item, key) => {
                        return (
                          <div>
                            {f === key ? (
                              <div>
                                <TimeSeries
                                  title={`Data from ${instrument.name} from Jan 1, 2020 to Jan 10, 2020`}
                                  // data={[pretendData[key]]}
                                  data={chartData(item.id)}
                                />
                              </div>
                            ) : null}
                          </div>
                        )
                      }
                      )}
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
