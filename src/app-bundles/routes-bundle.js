import { createRouteBundle } from 'redux-bundler';

import CollectionGroup from '../app-pages/collectiongroup/collectiongroup';
import Group from '../app-pages/group/details';
import Help from '../app-pages/help/help';
import Home from '../app-pages/home/home';
import Instrument from '../app-pages/instrument/details';
import Logout from '../app-pages/logout';
import NotFound from '../app-pages/404';
import Profile from '../app-pages/profile/userProfile';
import Project from '../app-pages/project';
import SignUp from '../app-pages/signup/signup';

export default createRouteBundle(
  {
    '': Home,
    '/': Home,
    '/help': Help,
    '/logout': Logout,
    '/signup': SignUp,
    '/profile': Profile,
    '/:projectSlug': Project,
    '/:projectSlug/groups/:groupSlug': Group,
    '/:projectSlug/instruments/:instrumentSlug': Instrument,
    '/:projectSlug/collection-groups/:collectionGroupSlug': CollectionGroup,
    '*': NotFound,
  }
);
