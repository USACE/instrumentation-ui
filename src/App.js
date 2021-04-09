import React from 'react';
import { connect } from 'redux-bundler-react';

import Modal from './app-components/modal';

import './css/bootstrap/css/bootstrap.water.min.css';
import './css/mdi/css/materialdesignicons.min.css';
import './css/ms/css/mapskin.min.css';
import './css/index.scss';
import NavBar from './app-components/navigation';

export default connect('selectRoute', ({ route: Route }) => (
  <div>
    <NavBar theme='primary' fixed />
    <Route />
    <Modal closeWithEscape />
  </div>
));
