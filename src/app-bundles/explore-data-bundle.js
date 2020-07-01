export default {
  name: "exploreData",

  getReducer: () => {
    const initialData = {};

    return (state = initialData, { type, payload }) => {
      switch (type) {
        case "":
          return Object.assign({}, state, payload);
        default:
          return state;
      }
    };
  },
};
