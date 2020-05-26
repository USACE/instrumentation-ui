import React, { useState } from "react";
import { connect } from "redux-bundler-react";
import InstrumentForm from "./instrument-form";

const Table = connect(
  "doModalOpen",
  "selectProjectsByRoute",
  ({ projectsByRoute: project, doModalOpen, instruments, tools }) => {
    const [showOnlyActive, setShowOnlyActive] = useState(false);

    const toggleShowOnlyActive = () => {
      setShowOnlyActive(!showOnlyActive);
    };

    return (
      <table className="table is-fullwidth">
        <thead>
          <tr>
            <th>
              <label>
                <input onChange={toggleShowOnlyActive} type="checkbox"></input>
                Active
              </label>
            </th>
            <th>Name</th>
            <th>Type</th>
            <th>Height</th>
            <th>Tools</th>
          </tr>
        </thead>
        <tbody>
          {instruments
            .filter((i) => {
              if (showOnlyActive) {
                return i.active;
              } else {
                return true;
              }
            })
            .map((instrument, i) => {
              return (
                <tr key={i}>
                  <td style={{ width: "120px" }}>
                    <i
                      className={`mdi ${
                        instrument.active
                          ? "mdi-checkbox-marked-circle has-text-success"
                          : "mdi-alert-rhombus has-text-warning"
                      }`}
                    ></i>
                  </td>
                  <td style={{ width: "30%" }}>
                    <a href={`/${project.slug}/instruments/${instrument.slug}`}>
                      {instrument.name}
                    </a>
                  </td>
                  <td>{instrument.type}</td>
                  <td>{instrument.height}</td>
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
