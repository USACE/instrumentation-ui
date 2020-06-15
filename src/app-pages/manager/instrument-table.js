import React from "react";
import { connect } from "redux-bundler-react";
import InstrumentForm from "./instrument-form";

const Table = connect(
  "doModalOpen",
  "selectProjectsByRoute",
  ({ projectsByRoute: project, doModalOpen, instruments, tools }) => {
    return (
      <table className="table is-fullwidth">
        <thead>
          <tr>
            <th>Status</th>
            <th>Name</th>
            <th>Type</th>
            <th>Z-Reference</th>
            <th>Tools</th>
          </tr>
        </thead>
        <tbody>
          {instruments.map((instrument, i) => {
            return (
              <tr key={i}>
                <td title={`Instrument is ${instrument.status}`}>
                  <i
                    className={`mdi mdi-circle status-icon-${instrument.status} pr-2`}
                  ></i>
                  {instrument.status.charAt(0).toUpperCase() +
                    instrument.status.slice(1)}
                </td>
                <td style={{ width: "30%" }}>
                  <a href={`/${project.slug}/instruments/${instrument.slug}`}>
                    {instrument.name}
                  </a>
                </td>
                <td>{instrument.type}</td>
                <td>{instrument.zreference}</td>
                <td style={{ width: "200px" }}>
                  <button
                    title="Edit"
                    onClick={() => {
                      doModalOpen(InstrumentForm, { item: instrument });
                    }}
                    className="button is-small is-info is-outlined mr-3"
                  >
                    <i className="mdi mdi-pencil"></i>
                  </button>
                  {tools
                    ? tools.map((Tool, i) => {
                        return <Tool key={i} item={instrument} />;
                      })
                    : null}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
);

export default Table;
