import React from 'react';
import { connect } from 'redux-bundler-react';

import Explorer from '../explorer/explorer';
import Icon from '../../app-components/icon';
import ProjectDashboard from './dashboard/dashboard';
import Manager from '../manager/manager';
import SecondaryNavBar from '../../app-components/navigation/secondaryNavBar';

const Project = connect(
  'selectProjectsByRoute',
  ({
    projectsByRoute: project,
  }) => (
    project ? (
      <>
        <SecondaryNavBar
          headingNode={<h4>{project.name}</h4>}
          navLinks={[
            {
              title: <span><Icon icon='view-dashboard' />&nbsp;Dashboard</span>,
              content: <ProjectDashboard />,
              paddingSmall: true,
            }, {
              title: <span><Icon icon='format-list-bulleted' />&nbsp;Inventory Manager</span>,
              content: <Manager style={{ width: '100vw' }}/>,
              paddingSmall: true,
            }, {
              title: <span><Icon icon='map-marker-radius-outline' />&nbsp;Explorer</span>,
              content: <Explorer />,
              paddingSmall: true,
            },
          ]}
        />
      </>
    ) : <p className='m-2'>Loading Project Details...</p>
  )
);

export default Project;
