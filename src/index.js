import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'redux-bundler-react';
import { getNavHelper } from 'internal-nav-helper';

import App from './App';
import cache from './cache';
import getStore from './app-bundles';
import * as serviceWorker from './serviceWorker';

const container = document.getElementById('root');
const root = createRoot(container);

cache.getAll().then((initialData) => {
  const store = getStore(initialData);

  if (process.env.NODE_ENV === 'development') window.store = store;

  root.render(
    <Provider store={store}>
      <div onClick={getNavHelper(store.doUpdateUrl)}>
        <App />
      </div>
    </Provider>
  );
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
