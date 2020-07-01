import { createRouteBundle } from "redux-bundler";
import Home from "../app-pages/home/home";
import Explorer from "../app-pages/explorer/explorer";
import Instrument from "../app-pages/instrument/details";
import Group from "../app-pages/group/details";
import InstrumentManager from "../app-pages/manager/manager";
import Uploader from "../app-pages/uploader/uploader";
import Logout from "../app-pages/logout";
import NotFound from "../app-pages/404";

export default createRouteBundle(
  {
    "": Home,
    "/": Home,
    "/logout": Logout,
    "/:projectSlug/upload": Uploader,
    "/:projectSlug/manager": InstrumentManager,
    "/:projectSlug/explore": Explorer,
    "/:projectSlug/groups/:groupSlug": Group,
    "/:projectSlug/instruments/:instrumentSlug": Instrument,
    "*": NotFound,
  },
  {
    routeInfoSelector: "selectPathnameMinusHomepage",
  }
);
