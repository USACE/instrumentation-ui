import { createRouteBundle } from "redux-bundler";
import Home from "../app-pages/home/home";
import Explorer from "../app-pages/explorer/explorer";
import Instrument from "../app-pages/instrument/details";
import Group from "../app-pages/group/details";
import Help from "../app-pages/help/help";
import Manager from "../app-pages/manager/manager";
import Uploader from "../app-pages/uploader/uploader";
import Logout from "../app-pages/logout";
import NotFound from "../app-pages/404";
import SignUp from "../app-pages/signup/signup";
import Profile from "../app-pages/profile/userProfile";
import CollectionGroup from "../app-pages/collectiongroup/collectiongroup";

export default createRouteBundle(
  {
    "": Home,
    "/": Home,
    "/help": Help,
    "/logout": Logout,
    "/signup": SignUp,
    "/profile": Profile,
    "/:projectSlug/upload": Uploader,
    "/:projectSlug/manager": Manager,
    "/:projectSlug/explore": Explorer,
    "/:projectSlug/groups/:groupSlug": Group,
    "/:projectSlug/instruments/:instrumentSlug": Instrument,
    "/:projectSlug/collection-groups/:collectionGroupSlug": CollectionGroup,
    "*": NotFound,
  },
  {
    routeInfoSelector: "selectPathnameMinusHomepage",
  }
);
