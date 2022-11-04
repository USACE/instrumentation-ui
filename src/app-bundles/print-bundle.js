const printBundle = {
  name: 'print',

  getReducer: () => {
    const initialData = {
      chartData: null,
      layoutData: null,
    };

    return (state = initialData, { type, payload }) => {
      switch (type) {
        case 'PRINT_SET_DATA':
          return Object.assign({}, state, payload);
        default:
          return state;
      }
    };
  },

  doPrintSetData:
    (data, layout) =>
    ({ dispatch }) => {
      dispatch({
        type: 'PRINT_SET_DATA',
        payload: {
          chartData: data,
          layoutData: layout,
        },
      });
    },

  selectPrintData: (state) => state.print.chartData,
  selectPrintLayout: (state) => state.print.layoutData,
};

export default printBundle;
