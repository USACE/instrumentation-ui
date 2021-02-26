import React, { useState } from 'react';
import { connect } from 'redux-bundler-react';

import Button from '../../../app-components/button';
import InstrumentGroupForm from '../forms/instrument-group-form';
import RoleFilter from '../../../app-components/role-filter';
import Pagination from '../../../app-components/pagination';

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

    const handlePageChange = (newPage, pageSize) => {
      const lowerLimit = newPage * pageSize;
      const upperLimit = (newPage + 1) * pageSize;
      setUpperLimit(upperLimit);
      setLowerLimit(lowerLimit);
    };

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
                          variant='info'
                          size='small'
                          isOutline
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
          handlePageChange={handlePageChange}
        />
      </>
    );
  }
);

export default Table;
