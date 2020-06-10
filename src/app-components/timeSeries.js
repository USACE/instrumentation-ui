import React from "react";
import Plot from "react-plotly.js";

export default props => {
  return (
    <div className="panel">
      <div className="panel-block">
        <Plot
          data={props.data}
          layout={{ title: props.title, autosize: true }}
          config={{ responsive: true }}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </div>
  );
};
