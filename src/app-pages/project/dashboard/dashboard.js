import React from 'react';
import { connect } from 'redux-bundler-react';

import CollectionGroupCard from './cards/collectionGroupCard';
import InstrumentGroupCard from './cards/instrumentGroupCard';
import InstrumentStatusCard from './cards/instrumentStatusCard';
import InstrumentTypeCard from './cards/instrumentTypeCard';
import ReportsCard from './cards/reportsCard';
import { isUserAllowed } from '../../../app-components/role-filter';

const ProjectDashboard = connect(
  'selectProfileRolesObject',
  'selectProfileIsAdmin',
  'selectProjectsByRoute',
  ({
    profileRolesObject,
    profileIsAdmin,
    projectsByRoute: project,
  }) => {
    const { slug } = project;

    return (
      project ? (
        <div className='row px-3 pb-4'>
          <div className='col-8'>
            <InstrumentGroupCard />
            <CollectionGroupCard />
          </div>
          <div className='col-4'>
            <InstrumentTypeCard />
            <InstrumentStatusCard />
            {isUserAllowed(profileRolesObject, profileIsAdmin, [`${slug.toUpperCase()}.*`])
              ? <ReportsCard />
              : null
            }
          </div>
        </div>
      ) : null
    );
  }
);

export default ProjectDashboard;
