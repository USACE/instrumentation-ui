import React, { useEffect, useLayoutEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import debounce from 'lodash.debounce';
import { fromLonLat } from 'ol/proj';

const Map = forwardRef(({
  doMapsInitialize,
  doMapsShutdown,
  mapsObject,
  mapKey,
  options,
  isRelative = false,
}, ref) => {
  const el = useRef(null);
  const styles = isRelative
    ? { position: 'relative', top: 0, left: 0, width: '100%', height: '100%' }
    : { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 };

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

  return <div style={styles} ref={el} />;
});

export default Map;
