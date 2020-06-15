export default {
  name: "keyval",

  getReducer: () => {
    const initalData = {};
    return (state = initalData, { type, payload }) => {
      switch (type) {
        case "KEY_VALUE_UPDATE":
          return Object.assign({}, state, payload);
        default:
          return state;
      }
    };
  },

  doKeyValSet: (opt) => ({ dispatch }) => {
    dispatch({
      type: "KEY_VALUE_UPDATE",
      payload: opt,
    });
  },

  selectKeyValState: (state) => {
    return state.keyval;
  },
};
