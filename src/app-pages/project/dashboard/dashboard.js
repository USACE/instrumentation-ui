import React from 'react';
import { connect } from 'redux-bundler-react';

import InstrumentMeasurementCard from './instrumentMeasurementCard';
import InstrumentStatusCard from './instrumentStatusCard';
import ProjectDetails from './projectDetails';

const ProjectDashboard = connect(
  'selectProjectsByRoute',
  ({
    projectsByRoute: project,
  }) => {
    const { instrument_count, instrument_group_count } = project;

    return (
      <>
        <ProjectDetails />
        <div className='row pt-3 px-3'>
          <div className='col-8'>
            <InstrumentMeasurementCard />
          </div>
          <div className='col-4'>
            <InstrumentStatusCard />
          </div>
        </div>
      </>
    );
  }
);

export default ProjectDashboard;
