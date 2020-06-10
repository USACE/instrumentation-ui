export default {
    name: "chartConfig",
    getReducer: () => {
        const initialData = {
            chartType: "lines",
            chartLineWidth: 1,
            chartColor: "red"
        };

        return (state = initialData, { type, payload }) => {
            switch (type) {
                case "CHART_TYPE_UPDATED":
                case "CHART_WIDTH_UPDATED":
                case "CHART_COLOR_UPDATED":
                    return Object.assign({}, state, payload);
                default:
                    return state;
            }
        };
    },

    doChartUpdateType: type => ({ dispatch, store }) => {
        dispatch({
            type: "CHART_TYPE_UPDATED",
            payload: { chartType: type }
        });
    },
    doChartUpdateWidth: width => ({ dispatch, store }) => {
        dispatch({
            type: "CHART_WIDTH_UPDATED",
            payload: { chartLineWidth: width }
        });
    },
    doChartUpdateColor: color => ({ dispatch, store }) => {
        dispatch({
            type: "CHART_COLOR_UPDATED",
            payload: { chartColor: color.rgb }
        });
    },
    selectChartType: state => state.chartConfig.chartType,
    selectChartLineWidth: state => state.chartConfig.chartLineWidth,
    selectChartColor: state => state.chartConfig.chartColor
};
