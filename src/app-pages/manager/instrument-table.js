import React from "react";
import { connect } from "redux-bundler-react";
import InstrumentForm from "./instrument-form";

const Table = connect("doModalOpen", ({ doModalOpen, instruments }) => {
  return (
    <table className="table" style={{ width: "100%" }}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Height</th>
          <th>Tools</th>
        </tr>
      </thead>
      <tbody>
        {instruments
          .sort((a, b) => {
            if (a.name > b.name) return 1;
            if (a.name < b.name) return -1;
            return 0;
          })
          .map((instrument, i) => {
            return (
              <tr key={i}>
                <td>
                  <a href={`/instruments/${instrument.slug}`}>
                    {instrument.name}
                  </a>
                </td>
                <td>{instrument.type}</td>
                <td>{instrument.height}</td>
                <td>
                  <button
                    onClick={() => {
                      doModalOpen(InstrumentForm, { item: instrument });
                    }}
                    className="button is-small is-info is-outlined"
                  >
                    <i className="mdi mdi-pencil"></i>
                  </button>
                </td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
});

export default Table;
