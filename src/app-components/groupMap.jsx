import React, { useEffect } from 'react';
import { connect } from 'redux-bundler-react';

export default connect(
  'doGroupMapInitialize',
  ({ doGroupMapInitialize, height, layers }) => {
    let mapEl = null;

    const opts = {
      layers: layers,
    };

    useEffect(() => {
      doGroupMapInitialize(mapEl, opts);
    }, [doGroupMapInitialize, mapEl, opts]);

    return (
      <div
        style={{ height: height }}
        ref={(el) => {
          mapEl = el;
        }}
      />
    );
  }
);
