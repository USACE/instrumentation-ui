import React from "react";
import { connect } from "redux-bundler-react";
import InstrumentGroupForm from "./instrument-group-form";

const Table = connect("doModalOpen", ({ doModalOpen, groups }) => {
  return (
    <table className="table" style={{ width: "100%" }}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Tools</th>
        </tr>
      </thead>
      <tbody>
        {groups.map((group, i) => {
          return (
            <tr key={i}>
              <td>
                <a href={`/groups/${group.slug}`}>{group.name}</a>
              </td>
              <td>{group.description}</td>
              <td>
                <button
                  onClick={() => {
                    doModalOpen(InstrumentGroupForm, { item: group });
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
