import * as Plotly from 'plotly.js/lib/core';
import * as Bar from 'plotly.js/lib/bar';
import * as Pie from 'plotly.js/lib/pie';
import * as Surface from 'plotly.js/lib/surface';
import * as Scatter3D from 'plotly.js/lib/scatter3d';

Plotly.register([
  /*
    Add any non-standard graph types needed in the application here, such as:
    'plotly.js/lib/heatmap',
    List of available imports can be found here `node_modules/plotly.js/lib/index.js`
  */
  Bar,
  Pie,
  Surface,
  Scatter3D,
]);

export default Plotly;