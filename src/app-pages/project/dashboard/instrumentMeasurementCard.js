import React from 'react';
import { connect } from 'redux-bundler-react';

import Card from '../../../app-components/card';
import ProgressBar from '../../../app-components/progress-bar';

const MeasurementRow = ({ name, url }) => (
  <div className='measurement-row' key={name}>
    <a href={url}>{name}</a>
    <ProgressBar percent={52} />
    <p className='measurement'>52</p>
  </div>
);

const InstrumentMeasurementCard = connect(
  'selectProjectsByRoute',
  'selectInstrumentGroupsItems',
  ({
    projectsByRoute: project,
    instrumentGroupsItems: groups,
  }) => (
    <Card>
      <Card.Header text='Instrument Groups' />
      <Card.Body>
        <p className='text-primary table-heading'>Active Measurements Today</p>
        {groups ? groups.map(group => {
          const { name, slug } = group;
          return (
            <MeasurementRow
              name={name}
              url={`/${project.slug}/groups/${slug}`}
            />
          );
        }) : <p>No Instrument Groups</p>}
      </Card.Body>
    </Card>
  )
);

export default InstrumentMeasurementCard;
