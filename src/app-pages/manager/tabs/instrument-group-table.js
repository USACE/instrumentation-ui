import React, { useState } from 'react';
import { connect } from 'redux-bundler-react';

import Button from '../../../app-components/button';
import InstrumentGroupForm from '../forms/instrument-group-form';
import Pagination, { handlePageChange } from '../../../app-components/pagination';
import RoleFilter from '../../../app-components/role-filter';

const Table = connect(
  'doModalOpen',
  'selectProjectsByRoute',
  ({
    doModalOpen,
    projectsByRoute: project,
    groups,
  }) => {
    const [upperLimit, setUpperLimit] = useState(groups.length);
    const [lowerLimit, setLowerLimit] = useState(0);

    return (
      <>
        <table className='table' style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Tools</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group, i) => {
              if (i >= lowerLimit && i < upperLimit) {
                return (
                  <tr key={i}>
                    <td style={{ width: '15%' }}>
                      <a href={`/${project.slug}/groups/${group.slug}`}>
                        {group.name}
                      </a>
                    </td>
                    <td>{group.description}</td>
                    <td style={{ width: '200px' }}>
                      <RoleFilter allowRoles={[`${project.slug.toUpperCase()}.*`]}>
                        <Button
                          isOutline
                          size='small'
                          variant='info'
                          title='Edit'
                          handleClick={() => doModalOpen(InstrumentGroupForm, { item: group })}
                          icon={<i className='mdi mdi-pencil' />}
                        />
                      </RoleFilter>
                    </td>
                  </tr>
                );
              }
            })}
          </tbody>
        </table>
        <Pagination
          itemCount={groups.length}
          handlePageChange={(newPage, pageSize) => handlePageChange({ newPage, pageSize, setUpperLimit, setLowerLimit })}
        />
      </>
    );
  }
);

export default Table;
