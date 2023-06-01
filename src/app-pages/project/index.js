import React from 'react';
import { connect } from 'redux-bundler-react';

import AdminPage from './admin';
import BatchPlotting from './batch-plotting';
import DataLoggers from './data-loggers';
import Explorer from '../explorer/explorer';
import Icon from '../../app-components/icon';
import ProjectDashboard from './dashboard';
import AllInstruments from './all-instruments';
import SecondaryNavBar from '../../app-components/navigation/secondaryNavBar';
import QaQc from './qa-qc';
import Uploader from './uploader';
import { isUserAllowed } from '../../app-components/role-filter';

const Title = ({ text, icon }) => (
  <span><Icon icon={icon} />&nbsp;{text}</span>
);

const Project = connect(
  'selectProfileRolesObject',
  'selectProfileIsAdmin',
  'selectProjectsByRoute',
  ({
    profileRolesObject,
    profileIsAdmin,
    projectsByRoute: project,
  }) => {
    if (!project) {
      return <p className='m-2'>Loading Project Details...</p>;
    }

    const activeLinks = [
      // Always Active
      ...[{
        title: <Title text='Dashboard' icon='view-dashboard' />,
        content: <ProjectDashboard />,
        paddingSmall: true,
        uri: '#dashboard',
      }, {
        title: <Title text='Explorer' icon='map-marker-radius-outline' />,
        content: <Explorer />,
        paddingSmall: true,
        uri: '#explorer',
      }, {
        title: <Title text='All Instruments' icon='speedometer' />,
        content: <AllInstruments style={{ width: '100vw' }}/>,
        paddingSmall: true,
        uri: '#all-instruments',
      }],
      // Active if User === Project Member
      ...isUserAllowed(profileRolesObject, profileIsAdmin, [`${project.slug.toUpperCase()}.*`]) ? [{
        title: <Title text='Uploader' icon='cloud-upload-outline' />,
        content: <Uploader />,
        paddingSmall: true,
        uri: '#uploader',
      }, {
        title: <Title text='Batch Plotting' icon='chart-areaspline' />,
        content: <BatchPlotting />,
        paddingSmall: true,
        uri: '#batch-plotting',
      }, {
        title: <Title text='QA/QC' icon='file-chart-check-outline' />,
        content: <QaQc />,
        paddingSmall: true,
        uri: '#qa-qc',
      }] : [],
      // Active if User === Project Admin
      ...isUserAllowed(profileRolesObject, profileIsAdmin, [`${project.slug.toUpperCase()}.ADMIN`]) ? [{
        title: <Title text='Data Loggers' icon='waveform' />,
        content: <DataLoggers />,
        paddingSmall: true,
        uri: '#data-loggers',
      }, {
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
