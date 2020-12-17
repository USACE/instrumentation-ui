import React, { useState, useEffect } from "react";
import { connect } from "redux-bundler-react";

import AboutButton from "./about-button";
import Button from '../../app-components/button';

export default connect(
  "doExploreMapInteractionsReset",
  "doExploreMapInteractionsSelectMode",
  ({ doExploreMapInteractionsReset, doExploreMapInteractionsSelectMode }) => {
    const [active, setActive] = useState(false);

    useEffect(() => {
      if (active) {
        if (typeof doExploreMapInteractionsSelectMode === "function")
          doExploreMapInteractionsSelectMode();
      } else {
        if (typeof doExploreMapInteractionsReset === "function")
          doExploreMapInteractionsReset();
      }
    }, [
      active,
      doExploreMapInteractionsReset,
      doExploreMapInteractionsSelectMode,
    ]);

    return (
      <div style={{ position: "absolute", left: 10, top: 10, right: 10 }}>
        <Button
          className={`${active ? 'active' : ''} mr-2`}
          title='Select by box'
          handleClick={() => setActive(!active)}
          icon={<i className='ms ms-select-box' />}
        />
        <AboutButton />
      </div>
    );
  }
);
