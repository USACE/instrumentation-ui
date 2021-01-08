import { createSelector } from 'redux-bundler';
import { trendline } from '../utils';
import { subDays } from 'date-fns';

const now = new Date();
const initialData = {
  selectionVersion: null,
  showSettings: false,
  chartType: 'timeseries',
  series: {},
  correlationSeriesX: '',
  correlationSeriesY: '',
  correlationMinDate: subDays(now, 60),
  correlationMaxDate: now,
  showToday: false,
  showRainfall: true,
  exactMatchesOnly: true,
  layout: {
    title: {
      text: '',
      y: 0.915,
      yanchor: 'bottom',
    },
    autosize: true,
    showlegend: true,
    dragmode: 'pan',
    margin: {
      t: 150,
    },
    yaxis: {
      autorange: true,
      range: [0, 100],
      title: {
        text: '',
      },
    },
    yaxis2: {
      range: [10, 0],
      title: {
        text: 'Rainfall',
      },
    },
    xaxis: {
      autorange: true,
      range: [0, 100],
      title: {
        text: '',
      },
    },
    grid: {},
    shapes: [],
    annotations: [],
  },
  data: [],
  frames: [],
  config: {
    responsive: true,
    displaylogo: false,
    displayModeBar: true,
    modeBarButtonsToRemove: ['select2d', 'lasso2d', 'zoomIn2d', 'zoomOut2d'],
    scrollZoom: true,
  },
};

const chartEditorBundle = {
  name: 'chartEditor',

  getReducer: () => {
    return (state = initialData, { type, payload }) => {
      switch (type) {
        case 'CHART_EDITOR_UPDATE':
        case 'CHART_EDITOR_TRIGGER_MEASURE_LOAD':
          return { ...state, ...payload };
        default:
          return state;
      }
    };
  },

  doChartEditorSetShowSettings: (showSettings) => ({ dispatch }) => {
    dispatch({
      type: 'CHART_EDITOR_UPDATE',
      payload: {
        showSettings,
      },
    });
  },

  doChartEditorSetSeries: (series) => ({ dispatch }) => {
    dispatch({
      type: 'CHART_EDITOR_UPDATE',
      payload: {
        series,
      },
    });
  },

  doChartEditorSetChartType: (chartType) => ({ dispatch }) => {
    dispatch({
      type: 'CHART_EDITOR_UPDATE',
      payload: {
        chartType,
        layout: initialData.layout,
      },
    });
  },

  doChartEditorSetCorrelationSeriesX: (correlationSeriesX) => ({
    dispatch,
  }) => {
    dispatch({
      type: 'CHART_EDITOR_UPDATE',
      payload: {
        correlationSeriesX,
      },
    });
  },

  doChartEditorSetCorrelationSeriesY: (correlationSeriesY) => ({
    dispatch,
  }) => {
    dispatch({
      type: 'CHART_EDITOR_UPDATE',
      payload: {
        correlationSeriesY,
      },
    });
  },

  doChartEditorSetCorrelationDates: (from, to) => ({ dispatch }) => {
    const f = from instanceof Date ? from.toISOString() : from;
    const t = to instanceof Date ? to.toISOString() : to;
    dispatch({
      type: 'CHART_EDITOR_UPDATE',
      payload: {
        correlationMinDate: f,
        correlationMaxDate: t,
      },
    });
  },

  doChartEditorSetShowToday: (showToday) => ({ dispatch }) => {
    dispatch({
      type: 'CHART_EDITOR_UPDATE',
      payload: {
        showToday,
      },
    });
  },

  doChartEditorSetShowRainfall: (showRainfall) => ({ dispatch }) => {
    dispatch({
      type: 'CHART_EDITOR_UPDATE',
      payload: {
        showRainfall,
      },
    });
  },

  doChartEditorSetExactMatchesOnly: (exactMatchesOnly) => ({ dispatch }) => {
    dispatch({
      type: 'CHART_EDITOR_UPDATE',
      payload: {
        exactMatchesOnly,
      },
    });
  },

  doChartEditorSetLayout: (layout) => ({ dispatch }) => {
    dispatch({
      type: 'CHART_EDITOR_UPDATE',
      payload: {
        layout,
      },
    });
  },

  doChartEditorSetData: (data) => ({ dispatch }) => {
    dispatch({
      type: 'CHART_EDITOR_UPDATE',
      payload: {
        data,
      },
    });
  },

  doChartEditorSetFrames: (frames) => ({ dispatch }) => {
    dispatch({
      type: 'CHART_EDITOR_UPDATE',
      payload: {
        frames,
      },
    });
  },

  doChartEditorSetConfig: (config) => ({ dispatch }) => {
    dispatch({
      type: 'CHART_EDITOR_UPDATE',
      payload: {
        config,
      },
    });
  },

  doChartEditorTriggerExploreDataLoad: (selectionVersion, idsToLoad) => ({
    dispatch,
    store,
  }) => {
    dispatch({
      type: 'CHART_EDITOR_TRIGGER_MEASURE_LOAD',
      payload: {
        selectionVersion,
      },
    });

    store.doExploreDataLoad(idsToLoad);
  },

  selectChartEditorShowSettings: (state) => {
    return state.chartEditor.showSettings;
  },

  selectChartEditorChartType: (state) => {
    return state.chartEditor.chartType;
  },

  selectChartEditorSeries: (state) => {
    return state.chartEditor.series;
  },

  selectChartEditorCorrelationSeriesX: (state) => {
    return state.chartEditor.correlationSeriesX;
  },

  selectChartEditorCorrelationSeriesY: (state) => {
    return state.chartEditor.correlationSeriesY;
  },

  selectChartEditorCorrelationMinDate: (state) => {
    return state.chartEditor.correlationMinDate;
  },

  selectChartEditorCorrelationMaxDate: (state) => {
    return state.chartEditor.correlationMaxDate;
  },

  selectChartEditorShowToday: (state) => {
    return state.chartEditor.showToday;
  },

  selectChartEditorShowRainfall: (state) => {
    return state.chartEditor.showRainfall;
  },

  selectChartEditorExactMatchesOnly: (state) => {
    return state.chartEditor.exactMatchesOnly;
  },

  selectChartEditorLayout: (state) => {
    return state.chartEditor.layout;
  },

  selectChartEditorData: (state) => {
    return state.chartEditor.data;
  },

  selectChartEditorFrames: (state) => {
    return state.chartEditor.frames;
  },

  selectChartEditorConfig: (state) => {
    return state.chartEditor.config;
  },

  selectChartEditorSelectionVersion: (state) => {
    return state.chartEditor.selectionVersion;
  },

  selectChartEditorTimeseriesData: createSelector(
    'selectExploreDataByInstrumentId',
    'selectChartEditorShowRainfall',
    'selectRainfallData',
    (dataByInstrumentId, showRainfall, rainfallData) => {
      const chartSeries = [];
      Object.keys(dataByInstrumentId).forEach((id) => {
        const { timeseries } = dataByInstrumentId[id];
        if (!timeseries || !timeseries.length) return undefined;
        timeseries.forEach((series) => {
          const { items, style, instrument: instrumentName, name } = series;
          if (!items || !items.length) return undefined;
          const x = [];
          const y = [];
          items
            .map((item) => {
              return {
                time: Object.keys(item)[0],
                value: Object.values(item)[0],
              };
            })
            .sort((a, b) => {
              if (a.time > b.time) return 1;
              if (a.time < b.time) return -1;
              return 0;
            })
            .forEach((item) => {
              x.push(new Date(item.time));
              y.push(item.value);
            });
          chartSeries.push({
            type: 'scattergl',
            name: `${instrumentName} - ${name}`,
            x: x,
            y: y,
            ...style,
          });
        });
      });
      if (showRainfall) {
        chartSeries.push(...rainfallData);
      }
      return chartSeries;
    }
  ),

  selectChartEditorCorrelationData: createSelector(
    'selectExploreDataByInstrumentId',
    'selectChartEditorCorrelationSeriesX',
    'selectChartEditorCorrelationSeriesY',
    'selectChartEditorExactMatchesOnly',
    'selectChartEditorCorrelationMinDate',
    'selectChartEditorCorrelationMaxDate',
    (
      dataByInstrumentId,
      correlationSeriesX,
      correlationSeriesY,
      exactMatchesOnly,
      minDate,
      maxDate
    ) => {
      const chartSeries = [];

      const itemsByTimeseriesId = {};

      Object.keys(dataByInstrumentId).forEach((instrumentId) => {
        const timeseries = dataByInstrumentId[instrumentId].timeseries;
        timeseries.forEach((ts) => {
          itemsByTimeseriesId[ts.id] = ts.items || [];
        });
      });

      let xItems = [],
        yItems = [];
      if (
        itemsByTimeseriesId[correlationSeriesX] &&
        itemsByTimeseriesId[correlationSeriesY]
      ) {
        xItems = itemsByTimeseriesId[correlationSeriesX]
          .map((item) => {
            return {
              time: Object.keys(item)[0],
              value: Object.values(item)[0],
            };
          })
          .filter((item) => {
            if (minDate) {
              if (item.time < minDate) return false;
            }
            if (maxDate) {
              if (item.time > maxDate) return false;
            }
            return true;
          })
          .sort((a, b) => {
            if (a.time > b.time) return 1;
            if (a.time < b.time) return -1;
            return 0;
          });
        yItems = itemsByTimeseriesId[correlationSeriesY]
          .map((item) => {
            return {
              time: Object.keys(item)[0],
              value: Object.values(item)[0],
            };
          })
          .filter((item) => {
            if (minDate) {
              if (item.time < minDate) return false;
            }
            if (maxDate) {
              if (item.time > maxDate) return false;
            }
            return true;
          })
          .sort((a, b) => {
            if (a.time > b.time) return 1;
            if (a.time < b.time) return -1;
            return 0;
          });
      }

      const xseries = [];
      const yseries = [];
      let colorCount = 0;
      const colorseries = [];

      if (xItems && xItems.length && yItems && yItems.length) {
        if (exactMatchesOnly) {
          // if we limit to exact matches then it's easier
          // keep track of the last match, should speed things up
          let lastFind = 0;
          // loop through our values from the x-series
          for (var i = 0; i < xItems.length; i++) {
            const x = xItems[i];
            let y = null;
            // if our time is outside the bounds of the y-series, loop through til we get closer
            if (x.time < yItems[0].time) break;
            // if we're finally >= y[0] then we can start comparing them
            // if we get a match, set lastFind to speed the search up, will be slow if nothing matches...
            for (var n = lastFind; n < yItems.length; n++) {
              if (x.time === yItems[n].time) {
                y = yItems[n];
                lastFind = n;
                break;
              }
            }
            // if we got a match, add it to the chart
            if (x && y) {
              xseries.push(x.value);
              yseries.push(y.value);
              colorseries.push(colorCount++);
            }
          }
        } else {
          // otherwise we interpolate and get a point for each series piont and and an interpolated other one
        }
      }

      chartSeries.push({
        type: 'scattergl',
        name: 'Observations',
        mode: 'markers',
        x: xseries,
        y: yseries,
        marker: {
          color: colorseries,
        },
      });

      const trend = trendline(xseries, yseries);

      chartSeries.unshift({
        ...trend,
        ...{
          mode: 'lines',
          line: { width: 1, color: '#669BBC' },
          marker: { symbol: 'circle', color: '#669BBC' },
        },
      });

      var min = Infinity;
      var max = -Infinity;
      for (var u = 0; u < xseries.length; u++) {
        if (xseries[u] > max) max = xseries[u];
        if (xseries[u] < min) min = xseries[u];
      }
      chartSeries.push({
        name: 'Equiv.',
        mode: 'lines',
        line: { width: 2, color: '#000000' },
        x: [min, max],
        y: [min, max],
      });

      return chartSeries;
    }
  ),

  reactChartEditorFetchMeasurements: createSelector(
    'selectChartEditorSelectionVersion',
    'selectExploreMapInteractionsVersion',
    'selectExploreMapSelectedInstruments',
    (pastVersion, newVersion, instruments) => {
      if (newVersion > pastVersion) {
        const instrumentIds = instruments.map((instrument) => {
          return instrument.id;
        });
        if (instrumentIds.length) {
          return {
            actionCreator: 'doChartEditorTriggerExploreDataLoad',
            args: [newVersion, instrumentIds],
          };
        }
      }
    }
  ),
};

export default chartEditorBundle;
