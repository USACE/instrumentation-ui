import React from 'react';
import { connect } from 'redux-bundler-react';

import Explorer from '../explorer/explorer';
import Icon from '../../app-components/icon';
import ProjectDashboard from './dashboard/dashboard';
import Manager from '../manager/manager';
import SecondaryNavBar from '../../app-components/navigation/secondaryNavBar';
import Uploader from '../uploader/uploader';

const Title = ({ text, icon }) => (
  <span><Icon icon={icon} />&nbsp;{text}</span>
);

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
              title: <Title text='Dashboard' icon='view-dashboard' />,
              content: <ProjectDashboard />,
              paddingSmall: true,
            }, {
              title: <Title text='All Instruments' icon='speedometer' />,
              content: <Manager style={{ width: '100vw' }}/>,
              paddingSmall: true,
            }, {
              title: <Title text='Explorer' icon='map-marker-radius-outline' />,
              content: <Explorer />,
              paddingSmall: true,
            }, {
              title: <Title text='Uploader' icon='cloud-upload-outline' />,
              content: <Uploader />,
              paddingSmall: true,
            },
          ]}
        />
      </>
    ) : <p className='m-2'>Loading Project Details...</p>
  )
);

export default Project;
