import React from 'react';
import { connect } from 'redux-bundler-react';
import { ToastContainer } from 'react-toastify';

import Modal from './app-components/modal';
import NavBar from './app-components/navigation';
import PageContent from './app-components/pageContent';

import 'react-toastify/dist/ReactToastify.css';
import 'react-tooltip/dist/react-tooltip.css';
import './css/bootstrap/css/bootstrap.water.min.css';

import './css/ms/css/mapskin.min.css';
import './css/index.scss';

export default connect('selectRoute', ({ route: Route }) => (
  <>
    <NavBar theme='primary' />
    <ToastContainer autoClose={3500} hideProgressBar={false} />
    <PageContent>
      <Route />
    </PageContent>
    <Modal closeWithEscape />
  </>
));
