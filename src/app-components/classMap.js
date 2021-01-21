import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { connect } from 'redux-bundler-react';
import { fromLonLat } from 'ol/proj';
import debounce from 'lodash.debounce';

const Map = connect(
  'doMapsInitialize',
  'doMapsShutdown',
  'selectMapsObject',
  ({
    doMapsInitialize,
    doMapsShutdown,
    mapsObject,
    mapKey,
    options,
  }) => {
    const el = useRef(null);

    const updateSize = debounce(() => {
      if (mapsObject[mapKey]) mapsObject[mapKey].updateSize();
    }, 200);

    const ro = new ResizeObserver(updateSize);

    useLayoutEffect(() => {
      let newOptions = options;
      if (options && options.center) {
        newOptions = {
          ...options,
          center: fromLonLat(options.center)
        };
      }
      
      doMapsInitialize(mapKey, el.current, newOptions);
      ro.observe(el.current);
    }, []);

    useEffect(() => () => doMapsShutdown(mapKey), [doMapsShutdown, mapKey]);

    return (
      <div
        style={{ position: 'absolute', top: 0, right: 0, left: 0, bottom: 0 }}
        ref={el}
      />
    );
  }
);

export default Map;
