import { createRouteBundle } from "redux-bundler";
import Home from "../app-pages/home/home";
import Explorer from "../app-pages/explorer/explorer";
import Instrument from "../app-pages/instrument/details";
import Group from "../app-pages/group/details";
import InstrumentManager from "../app-pages/manager/manager";
import Uploader from "../app-pages/uploader/uploader";
import Logout from "../app-pages/logout";

export default createRouteBundle(
  {
    "": Home,
    "/": Home,
    "/logout": Logout,
    "/explore": Explorer,
    "/:projectSlug/upload": Uploader,
    "/:projectSlug/manager": InstrumentManager,
    "/:projectSlug/groups/:groupSlug": Group,
    "/:projectSlug/instruments/:instrumentSlug": Instrument,
    "*": Home,
  },
  {
    routeInfoSelector: "selectPathnameMinusHomepage",
  }
);
