import { createRouteBundle } from 'redux-bundler';

import CollectionGroup from '../app-pages/collection-group';
import InstrumentGroup from '../app-pages/instrument-group';
import Help from '../app-pages/help/help';
import Home from '../app-pages/home/home';
import Instrument from '../app-pages/instrument/details';
import Logout from '../app-pages/logout';
import NotFound from '../app-pages/404';
import Profile from '../app-pages/profile/userProfile';
import Project from '../app-pages/project';
import SignUp from '../app-pages/signup/signup';

const base = import.meta.env.VITE_URL_BASE_PATH ?? ''

export default createRouteBundle(
  {
    [`${base}`]: Home,
    [`${base}/`]: Home,
    [`${base}/help`]: Help,
    [`${base}/logout`]: Logout,
    [`${base}/signup`]: SignUp,
    [`${base}/profile`]: Profile,
    [`${base}/not-found`]: NotFound,
    [`${base}/:projectSlug`]: Project,
    [`${base}/:projectSlug/groups/:groupSlug`]: InstrumentGroup,
    [`${base}/:projectSlug/instruments/:instrumentSlug`]: Instrument,
    [`${base}/:projectSlug/collection-groups/:collectionGroupSlug`]: CollectionGroup,
    '*': NotFound,
  }
);
