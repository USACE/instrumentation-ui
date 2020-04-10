import React from "react";
import Plot from "react-plotly.js";

export default props => {
  return (
    <div className="panel">
      <div className="panel-block">
        <Plot
          data={[
            {
              x: props.x,
              y: props.y,
              type: "scatter"
            }
          ]}
          layout={{ title: props.title, autosize: true }}
          config={{ responsive: true }}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </div>
  );
};
