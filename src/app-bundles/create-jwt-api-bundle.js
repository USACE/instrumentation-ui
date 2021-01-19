const arrayIze = (thing) => {
  return !thing || Array.isArray(thing) ? thing : [thing];
};

const shouldSkipToken = (method, path, unless) => {
  let skip = false;
  // check for method
  if (unless && unless.method) {
    const methods = arrayIze(unless.method);
    if (methods.indexOf(method) !== -1) skip = true;
  }

  // check for path
  if (!skip) {
    if (unless && unless.path) {
      const paths = arrayIze(unless.path);
      if (paths.indexOf(path) !== -1) skip = true;
    }
  }

  // check custom
  if (!skip) {
    if (unless && unless.custom) {
      if (typeof unless.custom === 'function') {
        skip = unless.custom({ method: method, path: path });
      }
    }
  }

  return skip;
};

const processResponse = response => (
  new Promise((resolve, reject) => {
    const func = response.status < 400 ? resolve : reject;

    // Handle no content - @TODO: test this
    if (response.status === 204) {
      func({
        'status': response.status,
        'json': {},
      });
    } else {
      response.json()
        .then(json => func({
          'status': response.status,
          'json': json,
        }))
        .catch(e => console.error(e));
    }
  })
);

const commonFetch = (root, path, options, callback) => {
  fetch(`${root}${path}`, options)
    .then(processResponse)
    .then(response => {
      if (callback && typeof callback === 'function') {
        callback(null, response.json);
      }
    })
    .catch(response => {
      throw new ApiError(response.json, `Request returned a ${response.status}`);
    })
    .catch(err => {
      callback(err);
    });
};

class ApiError extends Error {
  constructor(data = {}, ...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }

    const dataKeys = Object.keys(data);

    this.name = 'Api Error';
    this.timestamp = new Date();

    dataKeys.forEach(key => {
      this[key] = data[key];
    })
  };
};

const createJwtApiBundle = (opts) => {
  const defaults = {
    name: 'api',
    root: '',
    tokenSelector: 'selectAuthToken',
    unless: null,
  };

  const config = Object.assign({}, defaults, opts);

  const uCaseName = config.name.charAt(0).toUpperCase() + config.name.slice(1);

  // selectors
  const selectRoot = `select${uCaseName}Root`;
  const selectUnless = `select${uCaseName}Unless`;
  const selectTokenSelector = `select${uCaseName}TokenSelector`;

  return {
    name: config.name,

    getReducer: () => {
      const initialData = {
        root: config.root,
        unless: config.unless,
        tokenSelector: config.tokenSelector,
      };

      return (state = initialData) => state;
    },

    [selectRoot]: (state) => state[config.name].root,
    [selectUnless]: (state) => state[config.name].unless,
    [selectTokenSelector]: (state) => state[config.name].tokenSelector,

    getExtraArgs: (store) => {
      const getCommonItems = () => ({
        root: store[selectRoot](),
        unless: store[selectUnless](),
        tokenSelector: store[selectTokenSelector](),
      });

      const defaultHeaders = token => ({
        Authorization: `Bearer ${token}`,
      });

      return {
        apiFetch: (path, options = {}) => {
          const { root, unless, tokenSelector } = getCommonItems();
          if (!shouldSkipToken(options.method, path, unless)) {
            const token = store[tokenSelector]();
            if (!token) return null;
            else {
              options.headers = { ...defaultHeaders(token) };
            }
          }
          return fetch(`${root}${path}`, options);
        },

        apiGet: (path, callback) => {
          const { root, unless, tokenSelector } = getCommonItems();
          const options = {
            method: 'GET',
          };
          if (!shouldSkipToken(options.method, path, unless)) {
            const token = store[tokenSelector]();
            if (!token) return null;
            else {
              options.headers = { ...defaultHeaders(token) };
            }
          }
          commonFetch(root, path, options, callback);
        },

        apiPut: (path, payload, callback) => {
          const { root, unless, tokenSelector } = getCommonItems();
          const options = {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
          };
          if (!shouldSkipToken(options.method, path, unless)) {
            const token = store[tokenSelector]();
            if (!token) return null;
            else {
              options.headers = {
                ...options.headers,
                ...defaultHeaders(token),
              };
            }
          }
          if (payload) {
            options.body = JSON.stringify(payload);
          }
          commonFetch(root, path, options, callback);
        },

        apiPost: (path, payload, callback) => {
          const { root, unless, tokenSelector } = getCommonItems();
          const options = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          };
          if (!shouldSkipToken(options.method, path, unless)) {
            const token = store[tokenSelector]();
            if (!token) return null;
            else {
              options.headers = {
                ...options.headers,
                ...defaultHeaders(token),
              };
            }
          }
          if (payload) {
            options.body = JSON.stringify(payload);
          }

          commonFetch(root, path, options, callback);
        },

        apiDelete: (path, callback) => {
          const { root, unless, tokenSelector } = getCommonItems();
          const options = {
            method: 'DELETE',
          };
          if (!shouldSkipToken(options.method, path, unless)) {
            const token = store[tokenSelector]();
            if (!token) return null;
            else {
              options.headers = { ...defaultHeaders(token) };
            }
          }
          commonFetch(root, path, options, callback);
        },
      };
    },
  };
};

export default createJwtApiBundle;
