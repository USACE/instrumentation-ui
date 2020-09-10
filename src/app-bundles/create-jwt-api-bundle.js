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
      if (typeof unless.custom === "function") {
        skip = unless.custom({ method: method, path: path });
      }
    }
  }

  return skip;
};

export default (opts) => {
  const defaults = {
    name: "api",
    root: "",
    tokenSelector: "selectAuthToken",
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

      return (state = initialData) => {
        return state;
      };
    },

    [selectRoot]: (state) => {
      return state[config.name].root;
    },

    [selectUnless]: (state) => {
      return state[config.name].unless;
    },

    [selectTokenSelector]: (state) => {
      return state[config.name].tokenSelector;
    },

    getExtraArgs: (store) => {
      return {
        apiFetch: (path, options = {}) => {
          const root = store[selectRoot]();
          const unless = store[selectUnless]();
          const tokenSelector = store[selectTokenSelector]();
          if (!shouldSkipToken(options.method, path, unless)) {
            const token = store[tokenSelector]();
            if (!token) {
              return null;
            } else {
              options.headers = {
                Authorization: "Bearer " + token,
              };
            }
          }
          return fetch(`${root}${path}`, options);
        },

        apiGet: (path, callback) => {
          const root = store[selectRoot]();
          const unless = store[selectUnless]();
          const tokenSelector = store[selectTokenSelector]();
          const options = {
            method: "GET",
          };
          if (!shouldSkipToken(options.method, path, unless)) {
            const token = store[tokenSelector]();
            if (!token) {
              return null;
            } else {
              options.headers = {
                Authorization: "Bearer " + token,
              };
            }
          }
          fetch(`${root}${path}`, options)
            .then((response) => {
              if (!response.ok) {
                throw new Error(`Request returned a ${response.status}`);
              }
              return response.json();
            })
            .then((json) => {
              if (callback && typeof callback === "function")
                callback(null, json);
            })
            .catch((err) => {
              callback(err);
            });
        },

        apiPut: (path, payload, callback) => {
          const root = store[selectRoot]();
          const unless = store[selectUnless]();
          const tokenSelector = store[selectTokenSelector]();
          const options = {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          };
          if (!shouldSkipToken(options.method, path, unless)) {
            const token = store[tokenSelector]();
            if (!token) {
              return null;
            } else {
              options.headers = {
                ...options.headers,
                Authorization: "Bearer " + token,
              };
            }
          }
          if (payload) {
            options.body = JSON.stringify(payload);
          }
          fetch(`${root}${path}`, options)
            .then((response) => {
              if (!response.ok) {
                throw new Error(`Request returned a ${response.status}`);
              }
              return response.json();
            })
            .then((json) => {
              if (callback && typeof callback === "function")
                callback(null, json);
            })
            .catch((err) => {
              callback(err);
            });
        },

        apiPost: (path, payload, callback) => {
          const root = store[selectRoot]();
          const unless = store[selectUnless]();
          const tokenSelector = store[selectTokenSelector]();
          const options = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };
          if (!shouldSkipToken(options.method, path, unless)) {
            const token = store[tokenSelector]();
            if (!token) {
              return null;
            } else {
              options.headers = {
                ...options.headers,
                Authorization: "Bearer " + token,
              };
            }
          }
          if (payload) {
            options.body = JSON.stringify(payload);
          }
          fetch(`${root}${path}`, options)
            .then((response) => {
              if (!response.ok) {
                throw new Error(`Request returned a ${response.status}`);
              }
              return response.json();
            })
            .then((json) => {
              if (callback && typeof callback === "function")
                callback(null, json);
            })
            .catch((err) => {
              callback(err);
            });
        },

        apiDelete: (path, callback) => {
          const root = store[selectRoot]();
          const unless = store[selectUnless]();
          const tokenSelector = store[selectTokenSelector]();
          const options = {
            method: "DELETE",
          };
          if (!shouldSkipToken(options.method, path, unless)) {
            const token = store[tokenSelector]();
            if (!token) {
              return null;
            } else {
              options.headers = {
                Authorization: "Bearer " + token,
              };
            }
          }
          fetch(`${root}${path}`, options)
            .then((response) => {
              if (!response.ok) {
                throw new Error(`Request returned a ${response.status}`);
              }
              return response.json();
            })
            .then((json) => {
              if (callback && typeof callback === "function")
                callback(null, json);
            })
            .catch((err) => {
              callback(err);
            });
        },
      };
    },
  };
};
