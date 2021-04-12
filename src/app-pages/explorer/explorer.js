import React, { useState, useCallback, useRef } from 'react';
import { connect } from 'redux-bundler-react';

import Panel from './panel';
import PanelGroup from 'react-panelgroup';
import Map from '../../app-components/classMap';
import MapLegend from './map-legend';
import MapTools from './map-tools';
import Visualizations from './explorer-visualizations';
import useWindowListener from '../../customHooks/useWindowListener';

export default connect(
  'doMapsInitialize',
  'doMapsShutdown',
  'selectExploreMapKey',
  'selectMapsObject',
  ({
    doMapsInitialize,
    doMapsShutdown,
    exploreMapKey: mapKey,
    mapsObject,
  }) => {
    const [landscapeMode, setLandscapeMode] = useState(false);
    const mapRef = useRef();

    const toggleLandscape = useCallback(
      (e) => {
        if (e.keyCode === 86 && e.shiftKey) {
          setLandscapeMode(!landscapeMode);
        }
      },
      [setLandscapeMode, landscapeMode]
    );

    useWindowListener('keydown', toggleLandscape);

    const hasDevBanner = process.env.REACT_APP_DEVELOPMENT_BANNER;

    return (
      <>
        <div
          style={{
            position: 'absolute',
            top: hasDevBanner ? 106 : 71,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <PanelGroup
            borderColor='#ccc'
            spacing={2}
            direction={landscapeMode ? 'column' : 'row'}
            onUpdate={(_data) =>
              mapRef && mapRef.current && mapRef.current.updateSize()
            }
          >
            <Panel>
              <Map
                ref={mapRef}
                mapKey={mapKey}
                options={{ center: [-80.8027, 26.9419], zoom: 10 }}
                doMapsInitialize={doMapsInitialize}
                doMapsShutdown={doMapsShutdown}
                mapsObject={mapsObject}
              />
              <MapTools />
              <MapLegend />
            </Panel>
            <Panel>
              <Visualizations />
            </Panel>
          </PanelGroup>
        </div>
      </>
    );
  }
);
