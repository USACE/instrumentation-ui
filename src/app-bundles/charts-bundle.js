let ID = 1;

const chartsBundle = {
  name: 'charts',

  getReducer: () => {
    const initialData = {};

    return (state = initialData, { type, payload }) => {
      switch (type) {
        case 'CHARTS_CREATE_NEW':
        case 'CHARTS_SAVE':
          return Object.assign({}, state, payload);
        default:
          return state;
      }
    };
  },

  doChartsCreateNew: () => ({ dispatch, store }) => {
    const id = ID++;
    dispatch({
      type: 'CHARTS_CREATE_NEW',
      payload: {
        [id]: {
          showSettings: false,
          title: '',
          xaxisTitle: '',
          yaxisTitle: '',
          shapes: [],
          series: {},
          chartType: 'timeseries',
          correlationSeriesY: '',
          correlationSeriesX: '',
          layout: {
            title: '',
            autosize: true,
            showlegend: false,
            dragmode: 'pan',
            yaxis: {
              autorange: true,
              title: {
                text: '',
              },
            },
            xaxis: {
              autorange: true,
              title: {
                text: '',
              },
            },
            shapes: [],
          },
          config: {
            responsive: true,
            displaylogo: false,
            displayModeBar: true,
            scrollZoom: true,
          },
          frames: [],
          data: [],
        },
      },
    });
  },

  doChartsSave: (id, figure) => ({ dispatch, store }) => {
    dispatch({
      type: 'CHARTS_SAVE',
      payload: {
        [id]: figure,
      },
    });
  },

  selectCharts: (state) => {
    return state.charts;
  },
};

export default chartsBundle;
