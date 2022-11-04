import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'redux-bundler-react';
import { getNavHelper } from 'internal-nav-helper';

import App from './App';
import cache from './cache';
import getStore from './app-bundles';

const container = document.getElementById('root');
const root = createRoot(container);

cache.getAll().then((initialData) => {
  const store = getStore(initialData);

  if (import.meta.env.DEV) window.store = store;

  root.render(
    <Provider store={store}>
      <div onClick={getNavHelper(store.doUpdateUrl)}>
        <App />
      </div>
    </Provider>
  );
});
