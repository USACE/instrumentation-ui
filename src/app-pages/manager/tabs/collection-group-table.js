import React, { useState } from 'react';
import { connect } from 'redux-bundler-react';

import CollectionGroupForm from '../forms/collection-group-form';
import RoleFilter from '../../../app-components/role-filter';
import Pagination, { handlePageChange } from '../../../app-components/pagination';
import Button from '../../../app-components/button';

const Table = connect(
  'doModalOpen',
  'selectProjectsByRoute',
  ({
    doModalOpen,
    projectsByRoute: project,
    collectionGroups,
  }) => {
    const [upperLimit, setUpperLimit] = useState(collectionGroups.length);
    const [lowerLimit, setLowerLimit] = useState(0);

    return (
      <>
        <table className='table' style={{ width: '100%' }}>
          <thead>
            <tr>
              <th className='w-75'>Name</th>
              <th>Tools</th>
            </tr>
          </thead>
          <tbody>
            {collectionGroups.map((g, i) => {
              if (i >= lowerLimit && i < upperLimit) {
                return (
                  <tr key={i}>
                    <td className='w-75'>
                      <a href={`/${project.slug}/collection-groups/${g.slug}`}>
                        {g.name}
                      </a>
                    </td>
                    <td style={{ width: '200px' }}>
                      <RoleFilter allowRoles={[`${project.slug.toUpperCase()}.*`]}>
                        <Button
                          isOutline
                          size='small'
                          variant='info'
                          title='Edit'
                          handleClick={() => doModalOpen(CollectionGroupForm, { item: g })}
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
          itemCount={collectionGroups.length}
          handlePageChange={(newPage, pageSize) => handlePageChange({ newPage, pageSize, setUpperLimit, setLowerLimit })}
        />
      </>
    );
  }
);

export default Table;
