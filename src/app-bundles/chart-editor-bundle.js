import { createSelector } from 'redux-bundler';
import { subDays } from 'date-fns';

import { trendline } from '../common/helpers/utils';

const initialData = {
  selectionVersion: null,
  showSettings: false,
  chartType: 'timeseries',
  series: {},
  correlationSeriesX: '',
  correlationSeriesY: '',
  correlationMinDate: subDays(new Date(), 7),
  correlationMaxDate: new Date(),
  showToday: false,
  showRainfall: false,
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
      range: [0, 0],
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

const getDomainName = (domains, parameter_id) => {
  if (!(domains && domains.parameter) || !parameter_id) return 'Unknown Parameter';

  const domain = domains.parameter.find(param => param.id === parameter_id);

  if (!domain) return 'Unknown Parameter';
  const name = domain.value;

  if (name === 'unknown') return 'Formula';

  return name.split('-').map(str => str.slice(0, 1).toUpperCase() + str.slice(1)).join(' ');
};

const chartEditorBundle = {
  name: 'chartEditor',

  getReducer: () => (state = initialData, { type, payload }) => {
    switch (type) {
      case 'CHART_EDITOR_UPDATE':
      case 'CHART_EDITOR_TRIGGER_MEASURE_LOAD':
        return { ...state, ...payload };
      default:
        return state;
    }
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
    const chartType = store.selectChartEditorChartType();
    const layout = store.selectChartEditorLayout();
    const minDate = store.selectChartEditorCorrelationMinDate();
    const maxDate = store.selectChartEditorCorrelationMaxDate();

    const from =
      chartType === 'timeseries'
        ? layout.xaxis.range[0]
          ? layout.xaxis.range[0]
          : null
        : minDate;
    const to =
      chartType === 'timeseries'
        ? layout.xaxis.range[1]
          ? layout.xaxis.range[1]
          : null
        : maxDate;

    const afterString = from ? new Date(from).toISOString() : '';
    const beforeString = to ? new Date(to).toISOString() : '';

    dispatch({
      type: 'CHART_EDITOR_TRIGGER_MEASURE_LOAD',
      payload: {
        selectionVersion,
      },
    });

    store.doExploreDataLoad(idsToLoad, beforeString, afterString);
  },

  selectChartEditorShowSettings: (state) => state.chartEditor.showSettings,

  selectChartEditorChartType: (state) => state.chartEditor.chartType,

  selectChartEditorSeries: (state) => state.chartEditor.series,

  selectChartEditorCorrelationSeriesX: (state) => state.chartEditor.correlationSeriesX,

  selectChartEditorCorrelationSeriesY: (state) => state.chartEditor.correlationSeriesY,

  selectChartEditorCorrelationMinDate: (state) => state.chartEditor.correlationMinDate,

  selectChartEditorCorrelationMaxDate: (state) => state.chartEditor.correlationMaxDate,

  selectChartEditorShowToday: (state) => state.chartEditor.showToday,

  selectChartEditorShowRainfall: (state) => state.chartEditor.showRainfall,

  selectChartEditorExactMatchesOnly: (state) => state.chartEditor.exactMatchesOnly,

  selectChartEditorLayout: (state) => state.chartEditor.layout,

  selectChartEditorData: (state) => state.chartEditor.data,

  selectChartEditorFrames: (state) => state.chartEditor.frames,

  selectChartEditorConfig: (state) => state.chartEditor.config,

  selectChartEditorSelectionVersion: (state) => state.chartEditor.selectionVersion,

  selectChartEditorTimeseriesData: createSelector(
    'selectExploreDataByInstrumentId',
    'selectChartEditorShowRainfall',
    'selectRainfallData',
    'selectDomainsItemsByGroup',
    (dataByInstrumentId, showRainfall, rainfallData, domains) => {
      const chartData = [];

      Object.keys(dataByInstrumentId).forEach((id) => {
        const { timeseries } = dataByInstrumentId[id];

        if (!timeseries || !timeseries.length) return undefined;

        timeseries.sort((a, b) => {
          if (a.name > b.name) return 1;
          if (a.name < b.name) return -1;
          return 0;
        });

        timeseries.forEach((series) => {
          const { items, style, instrument: instrumentName, name, parameter_id, unit_id, isInclinometer } = series;
          if (!items || !items.length) return undefined;

          const x = [];
          const y = [];
          const plotData = [];

          if (isInclinometer) {
            const negateDepth = val => val < 0 ? val : -val;

            items.forEach(item => {
              const time = Object.keys(item)[0];
              const data = Object.values(item)[0];

              // Push A CheckSums
              plotData.push({
                type: 'scattergl',
                name: `aChecksum - ${time}`,
                x: data.map(d => d.aChecksum),
                y: data.map(d => negateDepth(d.depth)),
                isInclinometer: true,
              });
              // Push B CheckSums
              plotData.push({
                type: 'scattergl',
                name: `bChecksum - ${time}`,
                x: data.map(d => d.bChecksum),
                y: data.map(d => negateDepth(d.depth)),
                isInclinometer: true,
              });
            });
          } else {
            items.map(item => ({
              time: Object.keys(item)[0],
              value: Object.values(item)[0],
            })).sort((a, b) => {
              if (a.time > b.time) return 1;
              if (a.time < b.time) return -1;
              return 0;
            }).forEach(item => {
              x.push(new Date(item.time));
              y.push(item.value);
            });

            plotData.push({
              type: 'scattergl',
              name: `${instrumentName} - ${name}`,
              x: x,
              y: y,
              ...style,
            });
          }

          const domainName = getDomainName(domains, parameter_id);
          const unitName = domains['unit'].find(el => el.id === unit_id)?.value;

          if (!chartData.find(x => x.name === parameter_id)) {
            chartData.push({
              id: series.id,
              name: parameter_id,
              domainName,
              unitName,
              unit: unit_id,
              data: plotData,
            });
          } else if (chartData.find(x => x.name === parameter_id).unit !== unit_id && chartData.findIndex(y => y.name === parameter_id) !== -1) {
            chartData.push({
              id: series.id,
              name: parameter_id,
              domainName,
              unitName,
              unit: unit_id,
              data: plotData,
            });
          } else {
            const foundIndex = chartData.findIndex(x => x.name === parameter_id);
            const item = chartData[foundIndex];

            chartData.splice(foundIndex, 1);

            chartData.push({
              id: series.id,
              name: parameter_id,
              domainName,
              unitName,
              unit: unit_id,
              data: [...item.data, ...plotData],
            });
          }
        });
      });
      if (showRainfall) {
        chartData.push(...rainfallData);
      }

      return chartData;
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

      let xItems = [];
      let yItems = [];
      if (
        itemsByTimeseriesId[correlationSeriesX] &&
        itemsByTimeseriesId[correlationSeriesY]
      ) {
        xItems = itemsByTimeseriesId[correlationSeriesX]
          .map((item) => ({
            time: Object.keys(item)[0],
            value: Object.values(item)[0],
          }))
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
          .map((item) => ({
            time: Object.keys(item)[0],
            value: Object.values(item)[0],
          }))
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
        const instrumentIds = instruments.map((instrument) => instrument.id);
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
