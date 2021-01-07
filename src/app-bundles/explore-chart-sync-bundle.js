const exploreChartSyncBundle = {
  name: 'exploreChartSync',

  getReducer: () => {
    const initialData = { xMin: 0, xMax: 100 };

    return (state = initialData, { type, payload }) => {
      switch (type) {
        case 'EXPLORE_CHART_SYNC_LAYOUT':
          return Object.assign({}, state, payload);
        default:
          return state;
      }
    };
  },

  doExploreChartSyncState: (xaxis) => ({ dispatch }) => {
    dispatch({
      type: 'EXPLORE_CHART_SYNC_LAYOUT',
      payload: {
        xMin: xaxis.range[0],
        xMax: xaxis.range[1],
      },
    });
  },

  selectExploreChartSyncXmin: (state) => {
    return state.exploreChartSync.xMin;
  },

  selectExploreChartSyncXmax: (state) => {
    return state.exploreChartSync.xMax;
  },
};

export default exploreChartSyncBundle;
