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
    "/explore": Explorer,
    "/upload": Uploader,
    "/logout": Logout,
    "/manager": InstrumentManager,
    "/groups/:groupSlug": Group,
    "/instruments/:instrumentSlug": Instrument,
  },
  {
    routeInfoSelector: "selectPathnameMinusHomepage",
  }
);
