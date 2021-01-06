import React from "react";
import { connect } from "redux-bundler-react";

import Button from "../../app-components/button";
import InstrumentForm from "./instrument-form";
import RoleFilter from "../../app-components/role-filter";

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
            <th>Tools</th>
          </tr>
        </thead>
        <tbody>
          {instruments.map((instrument, i) => {
            return (
              <tr key={i}>
                {instrument.status ? (
                  <td title={`Instrument is ${instrument.status}`}>
                    <i className={`mdi mdi-circle status-icon-${instrument.status} pr-2`} />
                    {instrument.status.charAt(0).toUpperCase() + instrument.status.slice(1)}
                  </td>) : <td />
                }
                <td style={{ width: "30%" }}>
                  <a href={`/${project.slug}/instruments/${instrument.slug}`}>
                    {instrument.name}
                  </a>
                </td>
                <td>{instrument.type}</td>
                <td style={{ width: "200px" }}>
                  <RoleFilter allowRoles={[`${project.slug.toUpperCase()}.*`]}>
                    <Button
                      variant='info'
                      size='small'
                      isOutline
                      title='Edit'
                      className='mr-3'
                      handleClick={() => doModalOpen(InstrumentForm, { item: instrument })}
                      icon={<i className="mdi mdi-pencil" />}
                    />
                    {tools && (
                      tools.map((Tool, i) => <Tool key={i} item={instrument} />)
                    )}
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
