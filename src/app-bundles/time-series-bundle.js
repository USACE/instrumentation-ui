let apiRoot = "http://localhost:3030";
export default {
  name: "timeseries",

  getReducer: () => {
    const initialData = {
      data: [],
      x: [],
      y: [],
      shouldFetch: true
    };

    return (state = initialData, { type, payload }) => {
      switch (type) {
        case "TIME_SERIES_FETCH_STARTED":
        case "TIME_SERIES_FETCH_FINISHED":
          return Object.assign({}, state, payload);
        default:
          return state;
      }
    };
  },
  doTimeseriesFetch: x => ({ dispatch, store }) => {
    dispatch({
      type: "TIME_SERIES_FETCH_STARTED",
      payload: {
        shouldFetch: false
      }
    });
    fetch(apiRoot + "/timeseries_measurements/")
      .then(response => response.json())
      .then(j =>
        dispatch({ type: "TIME_SERIES_FETCH_FINISHED", payload: { data: j } })
      );
  },

  selectTimeseriesX: state => {
    return state.timeseries.data.map(item => {
      return new Date(item.time);
    });
  },

  selectTimeseriesY: state => {
    return state.timeseries.data.map(item => {
      return item.value;
    });
  },

  reactTimeseriesShouldFetch: state => {
    if (state.timeseries.shouldFetch)
      return {
        actionCreator: "doTimeseriesFetch"
      };
  }
};
