let xData = [
  new Date("1/1/2020  12:00:00 AM"),
  new Date("1/2/2020  12:00:00 AM"),
  new Date("1/3/2020  12:00:00 AM"),
  new Date("1/4/2020  12:00:00 AM"),
  new Date("1/5/2020  12:00:00 AM"),
  new Date("1/6/2020  12:00:00 AM"),
  new Date("1/7/2020  12:00:00 AM"),
  new Date("1/8/2020  12:00:00 AM"),
  new Date("1/9/2020  12:00:00 AM"),
  new Date("1/10/2020  12:00:00 AM")
];
let yData = [2, 6, 3, 4, 1, 9, 10, 7, 5, 8];

export default {
  name: "timeSeries",

  getReducer: () => {
    const initialData = {
      x: xData,
      y: yData
    };

    return (state = initialData, { type, payload }) => {
      switch (type) {
        case "TIME_SERIES_START":
        case "TIME_SERIES_FINISHED":
          return Object.assign({}, state, payload);
        default:
          return state;
      }
    };
  },
  doTimeSeriesUpdate: x => ({ dispatch, store }) => {
    dispatch({ type: "TIME_SERIES_START", payload: { data: x } });
  },

  selectTimeSeriesX: state => state.timeSeries.x,
  selectTimeSeriesY: state => state.timeSeries.y
};
