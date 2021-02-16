import React, { useEffect, useLayoutEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { fromLonLat } from 'ol/proj';
import debounce from 'lodash.debounce';

const Map = forwardRef(({
  doMapsInitialize,
  doMapsShutdown,
  mapsObject,
  mapKey,
  options,
}, ref) => {
  const el = useRef(null);

  const updateSize = debounce(() => {
    if (mapsObject[mapKey]) mapsObject[mapKey].updateSize();
  }, 200);

  const ro = new ResizeObserver(updateSize);

  useImperativeHandle(ref, () => ({
    updateSize: () => {
      if (mapsObject[mapKey]) mapsObject[mapKey].updateSize();
    }
  }));

  useLayoutEffect(() => {
    let newOptions = options;
    if (options && options.center) {
      newOptions = {
        ...options,
        center: fromLonLat(options.center)
      };
    }
    
    if (doMapsInitialize && typeof doMapsInitialize === 'function') {
      doMapsInitialize(mapKey, el.current, newOptions);
      ro.observe(el.current);
    }
  }, []);

  useEffect(() => () => {
    if (doMapsShutdown && typeof doMapsShutdown === 'function') {
      doMapsShutdown(mapKey);
    };
  }, [doMapsShutdown, mapKey]);

  return (
    <div
      style={{ position: 'absolute', top: 0, right: 0, left: 0, bottom: 0 }}
      ref={el}
    />
  );
});

export default Map;
