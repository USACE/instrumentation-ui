import React from "react";
import { connect } from "redux-bundler-react";

import CollectionGroupForm from "./collection-group-form";
import RoleFilter from "../../app-components/role-filter";

const Table = connect(
  "doModalOpen",
  "selectProjectsByRoute",
  ({ projectsByRoute: project, doModalOpen, collectionGroups }) => {
    return (
      <table className="table" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th className="w-75">Name</th>
            <th>Tools</th>
          </tr>
        </thead>
        <tbody>
          {collectionGroups.map((g, i) => {
            return (
              <tr key={i}>
                <td className="w-75">
                  <a href={`/${project.slug}/collection-groups/${g.slug}`}>
                    {g.name}
                  </a>
                </td>
                <td style={{ width: "200px" }}>
                  <RoleFilter allowRoles={[`${project.slug.toUpperCase()}.*`]}>
                    <button
                      onClick={() => {
                        doModalOpen(CollectionGroupForm, { item: g });
                      }}
                      className="btn btn-sm btn-outline-info"
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
