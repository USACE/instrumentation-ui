export default {
  name: 'districts',
  getReducer: () => {
    const initData = {
      districts: [],
    };

    return (state = initData, { type, payload }) => {
      switch (type) {
        case 'UPDATE_DISTRICT_DATA':
          return {
            ...state,
            districts: payload,
          };
        default:
          return state;
      }
    };
  },

  selectDistrictsRaw: (state) => state.districts,
  selectDistricts: (state) => state.districts.districts,

  doFetchDistricts: () => ({ apiGet, dispatch }) => {
    const url = `/districts`;

    apiGet(url, (err, body) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log('error: ', err);
      } else {
        dispatch({ type: 'UPDATE_DISTRICT_DATA', payload: body });
      }
    });
  },
};
