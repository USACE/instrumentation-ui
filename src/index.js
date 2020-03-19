import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "redux-bundler-react";
import { getNavHelper } from "internal-nav-helper";
import getStore from "./app-bundles";
import cache from "./cache";

import App from "./App";
import * as serviceWorker from "./serviceWorker";

cache.getAll().then(initialData => {
  const store = getStore(initialData);

  if (process.env.NODE_ENV === "development") window.store = store;

  ReactDOM.render(
    <Provider store={store}>
      <div onClick={getNavHelper(store.doUpdateUrlWithHomepage)}>
        <App />
      </div>
    </Provider>,
    document.getElementById("root")
  );
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
