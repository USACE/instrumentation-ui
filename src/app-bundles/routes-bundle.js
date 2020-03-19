import { createRouteBundle } from "redux-bundler";
import Home from "../app-pages/home/home";
import Explorer from "../app-pages/explorer/explorer";
import Instrument from "../app-pages/instrument/details";

export default createRouteBundle(
  {
    "/": Home,
    "/explore": Explorer,
    "/instrument/:id": Instrument
  },
  {
    routeInfoSelector: "selectPathnameMinusHomepage"
  }
);
