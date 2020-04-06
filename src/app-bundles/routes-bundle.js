import { createRouteBundle } from "redux-bundler";
import Home from "../app-pages/home/home";
import Explorer from "../app-pages/explorer/explorer";
import Instrument from "../app-pages/instrument/details";
import Uploader from "../app-pages/uploader/uploader";
import Logout from "../app-pages/logout";

export default createRouteBundle(
  {
    "/": Home,
    "/explore": Explorer,
    "/upload": Uploader,
    "/logout": Logout,
    "/instrument/:id": Instrument
  },
  {
    routeInfoSelector: "selectPathnameMinusHomepage"
  }
);
