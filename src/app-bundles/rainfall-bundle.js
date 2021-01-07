import { createSelector } from 'redux-bundler';

const rainfallBundle = {
  name: 'rainfall',

  getReducer: () => {
    const initialData = {
      _shouldLoad: true,
      items: [],
    };

    return (state = initialData, { type, payload }) => {
      switch (type) {
        case 'RAINFALL_LOAD_START':
        case 'RAINFALL_LOAD_FINISHED':
          return { ...state, ...payload };
        default:
          return state;
      }
    };
  },

  doRainfallLoad: () => ({ dispatch, store }) => {
    dispatch({
      type: 'RAINFALL_LOAD_START',
      payload: {
        _shouldLoad: false,
      },
    });

    const apiRoot = store.selectApiRoot();

    const tsId =
      process.env.NODE_ENV === 'development'
        ? '05ddb512-b865-433d-b2db-81e75bb69b65'
        : '9a3864a8-8766-4bfa-bad1-0328b166f6a8';
    fetch(
      `${apiRoot}/timeseries/${tsId}/measurements?after=1900-01-01T00:00:00.00Z&before=2025-01-01T00:00:00.00Z`
    )
      .then((response) => {
        return response.json();
      })
      .then((rainfall) => {
        dispatch({
          type: 'RAINFALL_LOAD_FINISHED',
          payload: {
            items: rainfall.items,
          },
        });
      });
  },

  selectRainfallItems: (state) => {
    return state.rainfall.items;
  },

  selectRainfallData: createSelector('selectRainfallItems', (items) => {
    const chartData = [];
    if (items && items.length) {
      const series = {
        name: 'Precip',
        type: 'bar',
        x: [],
        y: [],
        xaxis: 'x',
        yaxis: 'y2',
        line: {
          color: '#0062ff',
        },
      };
      items
        .sort((a, b) => {
          if (a.time > b.time) return 1;
          if (a.time < b.time) return -1;
          return 0;
        })
        .forEach((item) => {
          series.x.push(new Date(item.time));
          series.y.push(item.value);
        });
      chartData.push(series);
    }
    return chartData;
  }),

  reactRainfallShouldLoad: (state) => {
    if (state.rainfall._shouldLoad) return { actionCreator: 'doRainfallLoad' };
  },
};

export default rainfallBundle;