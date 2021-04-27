import React from 'react';
import { connect } from 'redux-bundler-react';

import CollectionGroupCard from './collectionGroupCard';
import InstrumentGroupCard from './instrumentGroupCard';
import InstrumentStatusCard from './instrumentStatusCard';
import ReportsCard from './reportsCard';

const ProjectDashboard = connect(
  'selectProjectsByRoute',
  ({
    projectsByRoute: project,
  }) => {
    const { instrument_count, instrument_group_count } = project;

    return (
      <>
        <div className='row pt-3 px-3'>
          <div className='col-8'>
            <InstrumentGroupCard />
            <CollectionGroupCard />
          </div>
          <div className='col-4'>
            <InstrumentStatusCard />
            <ReportsCard />
          </div>
        </div>
      </>
    );
  }
);

export default ProjectDashboard;
