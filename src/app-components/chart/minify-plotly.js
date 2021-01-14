var Plotly = require('plotly.js/lib/core');

Plotly.register([
  require('plotly.js/lib/heatmap'),
  require('plotly.js/lib/choropleth'),
  require('plotly.js/lib/scattergeo')
]);

module.exports = Plotly;