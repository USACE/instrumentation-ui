import React from 'react';
import { connect } from 'redux-bundler-react';
import { ToastContainer } from 'react-toastify';

import Modal from './app-components/modal';
import MovingBanner from './common/moving-banner';
import NavBar from './app-components/navigation';
import PageContent from './app-components/pageContent';

import 'react-toastify/dist/ReactToastify.css';
import 'react-tooltip/dist/react-tooltip.css';
import './css/bootstrap/css/bootstrap.water.min.css';

import './css/ms/css/mapskin.min.css';
import './css/index.scss';

const isMovingBannerActive = import.meta.env.VITE_MOVING_BANNER === 'true';

export default connect('selectRoute', ({ route: Route }) => (
  <>
    <NavBar theme='primary' />
    <ToastContainer autoClose={3500} hideProgressBar={false} />
    <PageContent>
      {isMovingBannerActive && <MovingBanner />}
      <Route />
    </PageContent>
    <Modal closeWithEscape />
  </>
));
