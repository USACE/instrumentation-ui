import React from "react";
import { connect } from "redux-bundler-react";
import InstrumentGroupForm from "./instrument-group-form";
import RoleFilter from "../../app-components/role-filter";

const Table = connect(
  "doModalOpen",
  "selectProjectsByRoute",
  ({ projectsByRoute: project, doModalOpen, groups }) => {
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
                <td style={{ width: "15%" }}>
                  <a href={`/${project.slug}/groups/${group.slug}`}>
                    {group.name}
                  </a>
                </td>
                <td>{group.description}</td>
                <td style={{ width: "200px" }}>
                  <RoleFilter allowRoles={[`${project.slug.toUpperCase()}.*`]}>
                    <button
                      onClick={() => {
                        doModalOpen(InstrumentGroupForm, { item: group });
                      }}
                      className="button is-small is-info is-outlined"
                    >
                      <i className="mdi mdi-pencil"></i>
                    </button>
                  </RoleFilter>
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
