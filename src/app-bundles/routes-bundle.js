import { createRouteBundle } from 'redux-bundler';

import BatchPlotting from '../app-pages/reporting/batch-plotting';
import CollectionGroup from '../app-pages/collectiongroup/collectiongroup';
import Explorer from '../app-pages/explorer/explorer';
import Group from '../app-pages/group/details';
import Help from '../app-pages/help/help';
import Home from '../app-pages/home/home';
import Instrument from '../app-pages/instrument/details';
import Logout from '../app-pages/logout';
import Manager from '../app-pages/manager/manager';
import NotFound from '../app-pages/404';
import Profile from '../app-pages/profile/userProfile';
import SignUp from '../app-pages/signup/signup';
import Uploader from '../app-pages/uploader/uploader';

export default createRouteBundle(
  {
    '': Home,
    '/': Home,
    '/help': Help,
    '/logout': Logout,
    '/signup': SignUp,
    '/profile': Profile,
    '/:projectSlug/upload': Uploader,
    '/:projectSlug/manager': Manager,
    '/:projectSlug/explore': Explorer,
    '/:projectSlug/batch-plotting': BatchPlotting,
    '/:projectSlug/groups/:groupSlug': Group,
    '/:projectSlug/instruments/:instrumentSlug': Instrument,
    '/:projectSlug/collection-groups/:collectionGroupSlug': CollectionGroup,
    '*': NotFound,
  },
  {
    routeInfoSelector: 'selectPathnameMinusHomepage',
  }
);
