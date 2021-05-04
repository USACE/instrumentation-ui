import React from 'react';
import { connect } from 'redux-bundler-react';

import AdminPage from './admin/admin';
import BatchPlotting from '../reporting/batch-plotting';
import Explorer from '../explorer/explorer';
import Icon from '../../app-components/icon';
import ProjectDashboard from './dashboard/dashboard';
import Manager from '../manager/manager';
import SecondaryNavBar from '../../app-components/navigation/secondaryNavBar';
import Uploader from '../uploader/uploader';
import { isUserAllowed } from '../../app-components/role-filter';

const Title = ({ text, icon }) => (
  <span><Icon icon={icon} />&nbsp;{text}</span>
);

const Project = connect(
  'selectAuthGroupRoles',
  'selectProjectsByRoute',
  'selectProfileActive',
  ({
    authGroupRoles,
    projectsByRoute: project,
    profileActive: profile,
  }) => {
    if (!project) {
      return <p className='m-2'>Loading Project Details...</p>;
    }

    const { is_admin } = profile;

    const activeLinks = [
      // Always Active
      ...[{
        title: <Title text='Dashboard' icon='view-dashboard' />,
        content: <ProjectDashboard />,
        paddingSmall: true,
        uri: '#dashboard',
      }],
      // Active if User === Member
      ...isUserAllowed(authGroupRoles, is_admin, [`${project.slug.toUpperCase()}.*`]) ? [{
        title: <Title text='All Instruments' icon='speedometer' />,
        content: <Manager style={{ width: '100vw' }}/>,
        paddingSmall: true,
        uri: '#all-instruments',
      }, {
        title: <Title text='Explorer' icon='map-marker-radius-outline' />,
        content: <Explorer />,
        paddingSmall: true,
        uri: '#explorer',
      }, {
        title: <Title text='Uploader' icon='cloud-upload-outline' />,
        content: <Uploader />,
        paddingSmall: true,
        uri: '#uploader',
      }, {
        title: <Title text='Batch Plotting' icon='file-chart' />,
        content: <BatchPlotting />,
        paddingSmall: true,
        uri: '#batch-plotting',
      }] : [],
      // Active if User === Admin
      // TOdO: REMOVE NOT
      ...isUserAllowed(authGroupRoles, is_admin, [`${project.slug.toUpperCase()}.ADMIN`]) ? [{
        title: <Title text='Admin' icon='shield-account' />,
        content: <AdminPage />,
        paddingSmall: true,
        uri: '#admin',
      }] : [],
    ];

    return <SecondaryNavBar navLinks={activeLinks} />;
  }
);

export default Project;
