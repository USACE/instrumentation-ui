/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from "react";
import { connect } from "redux-bundler-react";
import Navbar from "../../app-components/navbar";
import InstrumentForm from "../manager/instrument-form";
import InstrumentDisplay from "./instrument-display";
import Map from "../../app-components/classMap";
import Notes from "./notes";
import Settings from "./settings";
import RoleFilter from "../../app-components/role-filter";
import LoginMessage from "../../app-components/login-message";
import Dropdown from "../../app-components/dropdown";

const sortAlertsByDate = alerts => {
  return alerts.sort((a, b) => {
    if (a.create_date > b.create_date) return -1;
    if (b.create_date > a.create_date) return 1;
    return 0;
  });
};

const convertTimeAgo = milli => {
  const minutes = milli / 1000 / 60;

  if (minutes < 1) {
    return '< 1 minute';
  }

  if (minutes < 60) {
    return `${Math.floor(minutes)} minute${Math.floor(minutes) !== 1 ? 's' : ''}`;
  }

  const hours = minutes / 60;
  if (hours < 24) {
    return `${Math.floor(hours)} hour${Math.floor(hours) !== 1 ? 's' : ''}`;
  }

  const days = hours / 24;
  return `${Math.floor(days)} day${Math.floor(days) !== 1 ? 's' : ''}`;
}

const AlertEntry = connect(
  "selectProfileAlertsByInstrumentId",
  "doAlertReadSave",
  "doAlertUnreadSave",
  ({ item, profileAlertsByInstrumentId: userAlerts, doAlertReadSave, doAlertUnreadSave }) => {
    const timeAgo = convertTimeAgo(Date.now() - new Date(item.create_date));

    const userAlert = userAlerts.find(a => a.id === item.id);
    const isRead = userAlert ? userAlert.read : false;
    const toggleRead = userAlert ? (...params) => {
      isRead
        ? doAlertUnreadSave(...params)
        : doAlertReadSave(...params)
    } : () => { };

    return (
      item && (
        <div
          className={`alert-container${isRead ? '' : ' unread'}`}
          onClick={() => toggleRead(item, null, true, true)}
        >
          <span className="list-group-item list-group-item-action flex-column align-items-start">
            <div className="d-flex w-100 justify-content-between">
              <h5 className="mb-1">{item.name}</h5>
              <small>{timeAgo}</small>
            </div>
            <p className="mb-1">{item.body}</p>
          </span>
        </div>
      )
    );
  }
);

export default connect(
  "doModalOpen",
  "doAlertsFetch",
  "doInstrumentTimeseriesSetActiveId",
  "selectProjectsByRoute",
  "selectAlertsByRouteByInstrumentId",
  "selectInstrumentsByRoute",
  "selectInstrumentTimeseriesByInstrumentId",
  "selectTimeseriesMeasurementsItemsObject",
  "selectInstrumentTimeseriesActiveId",
  ({
    doModalOpen,
    doAlertsFetch,
    doInstrumentTimeseriesSetActiveId,
    projectsByRoute: project,
    instrumentsByRoute: instrument,
    instrumentTimeseriesByInstrumentId: timeseriesByInstrumentId,
    timeseriesMeasurementsItemsObject: measurements,
    instrumentTimeseriesActiveId: activeId,
    alertsByRouteByInstrumentId: alerts,
  }) => {
    if (!project || !instrument || !timeseriesByInstrumentId) return null;

    const timeseries = timeseriesByInstrumentId[instrument.id] || [];
    const len = timeseries.length;
    let firstTimeseries = null;
    if (len && len > 0) firstTimeseries = timeseries[0];
    useEffect(() => {
      if (!len || !firstTimeseries) {
        doInstrumentTimeseriesSetActiveId(null);
      }
      if (firstTimeseries && firstTimeseries.id) {
        doInstrumentTimeseriesSetActiveId(firstTimeseries.id);
      }
    }, [len, firstTimeseries, doInstrumentTimeseriesSetActiveId]);

    return (
      <div style={{ marginBottom: "200px" }}>
        <Navbar theme="primary" fixed />
        <section className="container-fluid" style={{ marginTop: "6rem" }}>
          <div className="row">
            <div className="col">
              <div className="card h-100">
                <div
                  className="card-header"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <strong>{instrument.name}</strong>{" "}
                  <RoleFilter
                    allowRoles={[`${project.slug.toUpperCase()}.*`]}
                    alt={LoginMessage}
                  >
                    <button
                      onClick={() => {
                        doModalOpen(InstrumentForm, { item: instrument });
                      }}
                      className="btn btn-sm btn-outline-info"
                    >
                      <i className="mdi mdi-pencil pr-2"></i> Edit
                    </button>
                  </RoleFilter>
                </div>
                <InstrumentDisplay item={instrument} />
              </div>
            </div>
            <div className="col">
              <div className="card h-100">
                <div className="card-header">
                  <strong>Alerts</strong>
                  <Dropdown.Menu
                    dropdownClass={['float-right', 'inline']}
                    buttonClass={['btn-sm', 'btn-outline-info']}
                    buttonContent={<i className='mdi mdi-cog-outline' />}
                  >
                    <Dropdown.Item>Filter Instrument Alerts</Dropdown.Item>
                    <Dropdown.Item>Mark All as Read</Dropdown.Item>
                  </Dropdown.Menu>
                  <button className="btn btn-sm btn-outline-info float-right mr-2" onClick={doAlertsFetch}>
                    <i className="mdi mdi-refresh" />
                  </button>
                </div>
                <div className="card-body" style={{ maxHeight: 400, overflow: "auto" }}>
                  <div className="list-group pb-2">
                    {sortAlertsByDate(alerts).map((a) => (
                      <AlertEntry key={a.id} item={a} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card h-100" style={{ position: "relative" }}>
                <div className="card-body">
                  <Map mapKey="instrumentMap" />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="container-fluid mt-4">
          <Settings />
        </section>
        <section className="container-fluid my-4">
          <Notes />
        </section>
      </div>
    );
  }
);
