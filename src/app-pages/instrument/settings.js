import React, { useState } from "react";
import { connect } from "redux-bundler-react";

export default connect(() => {
  const tabs = ["CONSTANTS", "FORMULA EDITOR", "TIMESERIES"];
  const [activeTab, setActiveTab] = useState(0);

  // eslint-disable-next-line
  return (
    <div className="panel">
      <div className="panel-heading">
        <div className="tabs">
          {tabs.map((tab, i) => {
            return (
              <div key={tab}>
                <ul>
                  <li className={activeTab === i ? "is-active" : ""}>
                    <a onClick={() => setActiveTab(i)}>{tab}</a>
                  </li>
                </ul>
              </div>
            );
          })}
        </div>
      </div>
      <div className="panel-block">
        <div className="container">
          <div className="tab is-active">Stuff here</div>
        </div>
      </div>
    </div>
  );
});
