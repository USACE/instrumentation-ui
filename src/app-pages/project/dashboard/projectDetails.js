import React from 'react';
import { connect } from 'redux-bundler-react';

import { pluralize } from '../../../utils';

import '../project.scss';

const ProjectDetails = connect(
  'selectProjectsByRoute',
  ({
    projectsByRoute: project,
  }) => {
    const { instrument_count, instrument_group_count } = project;

    return (
      <div className='details-container p-3'>
        <p className='text-muted text-uppercase'>
          <p className='measurement'>{instrument_count}</p>
          { pluralize('Instrument', 'Instruments', instrument_count) }
        </p>
        <p className='text-muted text-uppercase'>
          <p className='measurement'>{instrument_group_count}</p>
          { pluralize('Instrument Group', 'Instrument Groups', instrument_group_count) }
        </p>
        <p className='text-muted text-uppercase'>
          <p className='measurement'>{123}</p>
          { pluralize('Measurement', 'Measurements', 123) } Today
        </p>
        <p className='text-muted text-uppercase'>
          <p className='measurement'>{21}</p>
          { pluralize('Alert', 'Alerts', 21) } In Past 24 Hrs
        </p>
      </div>
    );
  }
);

export default ProjectDetails;
