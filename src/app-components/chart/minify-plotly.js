var Plotly = require('plotly.js/lib/core');

Plotly.register([
  /* 
    Add any non-standard graph types needed in the application here, such as:
    require('plotly.js/lib/heatmap'),

    List of available imports can be found here `node_modules/plotly.js/lib/index.js`
  */
  require('plotly.js/lib/bar'),
  require('plotly.js/lib/pie'),
]);

module.exports = Plotly;