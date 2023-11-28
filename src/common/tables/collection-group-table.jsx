import React, { useState } from 'react';
import { connect } from 'redux-bundler-react';
import { Edit } from '@mui/icons-material';

import Button from '../../app-components/button';
import CollectionGroupForm from '../../common/forms/collection-group-form';
import Link from '../../app-components/link';
import Pagination, { handlePageChange } from '../../app-components/pagination';
import RoleFilter from '../../app-components/role-filter';

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
                  <tr key={g.id}>
                    <td className='w-75'>
                      <Link to={`/${project.slug}/collection-groups/${g.slug}`}>
                        {g.name}
                      </Link>
                    </td>
                    <td style={{ width: '200px' }}>
                      <RoleFilter allowRoles={[`${project.slug.toUpperCase()}.*`]}>
                        <Button
                          isOutline
                          size='small'
                          variant='info'
                          title='Edit'
                          handleClick={() => doModalOpen(CollectionGroupForm, { item: g })}
                          icon={<Edit fontSize='inherit' />}
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
