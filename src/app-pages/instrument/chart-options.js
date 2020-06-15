import React from "react";
import { connect } from "redux-bundler-react";
import { ChromePicker } from 'react-color';


export default connect(
    "doChartUpdateType",
    "selectChartType",
    "selectChartColor",
    "doChartUpdateWidth",
    "doChartUpdateColor",
    ({ doChartUpdateType, doChartUpdateWidth, doChartUpdateColor, chartType, chartColor }) => {
        return (
            <div className="panel">
                <div
                    className="panel-heading"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between"
                    }}
                >
                    Chart Options
                </div>
                <div className="p-3">
                    <div className="columns">
                        <div className="column">
                            <div className="control">
                                <div className="select">
                                    <select onChange={e => doChartUpdateType(e.target.value)}>
                                        <option value={null}>Chart Type</option>
                                        <option value="markers">Markers</option>
                                        <option value="lines">Line</option>
                                        <option value="lines+markers">Line+Markers</option>
                                    </select>
                                </div>
                                <br />
                                <br />
                                {chartType !== "markers" ? (
                                    <div className="select">
                                        <select onChange={e => doChartUpdateWidth(e.target.value)}>
                                            <option value={null}>Line Width</option>
                                            <option value="1">.5</option>
                                            <option value="2">1</option>
                                            <option value="3">2</option>
                                            <option value="3">3</option>
                                        </select>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                        <div className="column">
                            <ChromePicker
                                color={chartColor}
                                onChange={doChartUpdateColor}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
);

