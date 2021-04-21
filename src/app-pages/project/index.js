import React from 'react';

import Explorer from '../explorer/explorer';
import Icon from '../../app-components/icon';
import ProjectDashboard from './dashboard';
import Manager from '../manager/manager';
import SecondaryNavBar from '../../app-components/navigation/secondaryNavBar';

const Project = () => (
  <div>
    <SecondaryNavBar
      headingNode={<h4>Huntington District</h4>}
      navLinks={[
        {
          title: <span><Icon icon='view-dashboard' />&nbsp;Dashboard</span>,
          content: <ProjectDashboard />,
        }, {
          title: <span><Icon icon='format-list-bulleted' />&nbsp;Inventory Manager</span>,
          content: <Manager style={{ width: '100vw' }}/>,
        }, {
          title: <span><Icon icon='map-marker-radius-outline' />&nbsp;Explorer</span>,
          content: <Explorer />,
        }, {
          title: <span><Icon icon='alert-outline' />&nbsp;Alerts</span>,
          content: (
            <div>
              To hold Alerts Page
            </div>
          ),
        },
      ]}
    />
  </div>
);

export default Project;
