import React from "react";
import { connect } from "redux-bundler-react";
import InstrumentForm from "./instrument-form";

const Table = connect("doModalOpen", ({ doModalOpen, instruments, tools }) => {
  return (
    <table className="table is-fullwidth">
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Height</th>
          <th>Tools</th>
        </tr>
      </thead>
      <tbody>
        {instruments.map((instrument, i) => {
          return (
            <tr key={i}>
              <td>
                <a href={`/instruments/${instrument.slug}`}>
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
                {tools.map((Tool, i) => {
                  return <Tool key={i} item={instrument} />;
                })}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
});

export default Table;
