import React from 'react';
import { connect } from 'redux-bundler-react';
import {
  AdminPanelSettingsOutlined,
  CloudUploadOutlined,
  Dashboard,
  ExploreOutlined,
  Speed,
  SsidChart,
  TaskOutlined,
  TimelineOutlined,
} from '@mui/icons-material';

import AdminPage from './admin';
import BatchPlotting from './batch-plotting';
import DataLoggers from './data-loggers';
import Explorer from '../explorer/explorer';
import ProjectDashboard from './dashboard';
import AllInstruments from './all-instruments';
import SecondaryNavBar from '../../app-components/navigation/secondaryNavBar';
import QaQc from './qa-qc';
import Uploader from './uploader';
import { isUserAllowed } from '../../app-components/role-filter';

const Title = ({ text, icon }) => (
  <span>{icon}&nbsp;{text}</span>
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
        title: <Title text='Dashboard' icon={<Dashboard fontSize='inherit' sx={{ marginBottom: '2px' }} />} />,
        content: <ProjectDashboard />,
        paddingSmall: true,
        uri: '#dashboard',
      }, {
        title: <Title text='Explorer' icon={<ExploreOutlined fontSize='inherit' sx={{ marginBottom: '2px' }} />} />,
        content: <Explorer />,
        paddingSmall: true,
        uri: '#explorer',
      }, {
        title: <Title text='All Instruments' icon={<Speed fontSize='inherit' sx={{ marginBottom: '2px' }} />} />,
        content: <AllInstruments style={{ width: '100vw' }}/>,
        paddingSmall: true,
        uri: '#all-instruments',
      }],
      // Active if User === Project Member
      ...isUserAllowed(profileRolesObject, profileIsAdmin, [`${project.slug.toUpperCase()}.*`]) ? [{
        title: <Title text='Uploader' icon={<CloudUploadOutlined fontSize='inherit' sx={{ marginBottom: '2px' }} />} />,
        content: <Uploader />,
        paddingSmall: true,
        uri: '#uploader',
      }, {
        title: <Title text='Batch Plotting' icon={<SsidChart fontSize='inherit' sx={{ marginBottom: '2px' }} />} />,
        content: <BatchPlotting />,
        paddingSmall: true,
        uri: '#batch-plotting',
      }, {
        title: <Title text='QA/QC' icon={<TaskOutlined fontSize='inherit' sx={{ marginBottom: '2px' }} />} />,
        content: <QaQc />,
        paddingSmall: true,
        uri: '#qa-qc',
      }] : [],
      // Active if User === Project Admin
      ...isUserAllowed(profileRolesObject, profileIsAdmin, [`${project.slug.toUpperCase()}.ADMIN`]) ? [{
        title: <Title text='Data Loggers' icon={<TimelineOutlined fontSize='inherit' sx={{ marginBottom: '2px' }} />} />,
        content: <DataLoggers />,
        paddingSmall: true,
        uri: '#data-loggers',
      }, {
        title: <Title text='Admin' icon={<AdminPanelSettingsOutlined fontSize='inherit' sx={{ marginBottom: '2px' }} />} />,
        content: <AdminPage />,
        paddingSmall: true,
        uri: '#admin',
      }] : [],
    ];

    return <SecondaryNavBar navLinks={activeLinks} />;
  }
);

export default Project;
