import React, { useState, useCallback, useRef, useEffect } from 'react';
import { connect } from 'redux-bundler-react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { useDeepCompareEffect } from 'react-use';

import Map from '../../app-components/classMap';
import MapLegend from './map-legend';
import MapTools from './map-tools';
import Visualizations from './explorer-visualizations';
import useWindowListener from '../../customHooks/useWindowListener';
import { classArray } from '../../common/helpers/utils';

import './explorer.scss';

const hasDevBanner = import.meta.env.VITE_DEVELOPMENT_BANNER = 'true';

export default connect(
  'doMapsInitialize',
  'doMapsShutdown',
  'doSetExploreDataFilters',
  'selectExploreMapKey',
  'selectMapsObject',
  ({
    doMapsInitialize,
    doMapsShutdown,
    doSetExploreDataFilters,
    exploreMapKey: mapKey,
    mapsObject,
  }) => {
    const [landscapeMode, setLandscapeMode] = useState(false);
    const [legendFilters, setLegendFilters] = useState({
      type: [],
      status: [],
    });
    const mapRef = useRef();

    const cls = classArray([
      'explorer-container',
      hasDevBanner && 'with-banner',
    ]);

    const toggleLandscape = useCallback(
      (e) => {
        if (e.keyCode === 86 && e.shiftKey) {
          setLandscapeMode(!landscapeMode);
          if (mapRef && mapRef.current) mapRef.current.updateSize();
        }
      },
      [setLandscapeMode, landscapeMode, mapRef.current]
    );

    useDeepCompareEffect(() => {
      doSetExploreDataFilters(legendFilters);
    }, [legendFilters]);

    useEffect(() => {
      if (mapRef && mapRef.current) mapRef.current.updateSize();
    }, [mapRef.current]);

    useWindowListener('keydown', toggleLandscape);

    return (
      <div className={cls}>
        <PanelGroup direction={landscapeMode ? 'vertical' : 'horizontal'}>
          <Panel defaultSize={50}>
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              <Map
                ref={mapRef}
                mapKey={mapKey}
                options={{ center: [-98.6, 39.8], zoom: 4 }}
                doMapsInitialize={doMapsInitialize}
                doMapsShutdown={doMapsShutdown}
                mapsObject={mapsObject}
              />
              <MapTools />
              <MapLegend setLegendFilters={setLegendFilters} legendFilters={legendFilters} />
            </div>
          </Panel>
          <PanelResizeHandle style={{ border: '1px solid gray' }}/>
          <Panel defaultSize={50} style={{ overflow: 'auto' }}>
            <Visualizations />
          </Panel>
        </PanelGroup>
      </div>
    );
  }
);
