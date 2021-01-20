import { Control } from 'ol/control';
import { XYZ } from 'ol/source';
import { Tile } from 'ol/layer';

import './basemap-picker.css';

const basemaps = [
  {
    id: 'OpenStreetMap',
    name: 'OpenStreetMap',
    url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    maxZoom: 19,
    attributions:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
  {
    id: 'MapBoxStreets',
    name: 'MapBox Streets',
    url:
      'https://api.tiles.mapbox.com/v4/willbreitkreutzwork.p9ej01m9/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoidXNhY2UiLCJhIjoiY2o1MDZscms4MDI4MjMycG1wa3puc212MCJ9.CW7edZMtlx5vFLNF5P-zTA',
    attributions:
      'Imagery from <a href="https://mapbox.com/about/maps/">MapBox</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
  {
    id: 'MapBoxAerial',
    name: 'MapBox Aerial',
    url:
      'https://api.tiles.mapbox.com/v4/willbreitkreutzwork.pki0cla6/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoidXNhY2UiLCJhIjoiY2o1MDZscms4MDI4MjMycG1wa3puc212MCJ9.CW7edZMtlx5vFLNF5P-zTA',
    attributions:
      'Imagery from <a href="https://mapbox.com/about/maps/">MapBox</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
  {
    id: 'MapBoxOutdoor',
    name: 'MapBox Outdoor',
    url:
      'https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoidXNhY2UiLCJhIjoiY2o1MDZscms4MDI4MjMycG1wa3puc212MCJ9.CW7edZMtlx5vFLNF5P-zTA',
    attributions:
      'Imagery from <a href="https://mapbox.com/about/maps/">MapBox</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
  {
    id: 'StamenToner',
    name: 'Stamen Toner',
    url: 'https://stamen-tiles-{a-c}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png',
    attributions:
      'Map tiles by <a href="https://stamen.com">Stamen Design</a>, <a href="https://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 20,
  },
  {
    id: 'EsriWorldStreetMap',
    name: 'ESRI Streetmap',
    url:
      'https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    attributions:
      'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012',
  },
  {
    id: 'EsriWorldImagery',
    name: 'ESRI World Imagery',
    url:
      'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attributions:
      'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
  },
  {
    id: 'EsriUSATopoMaps',
    name: 'ESRI Topo Maps',
    url:
      'https://services.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer/tile/{z}/{y}/{x}',
    attributions:
      'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
  },
  {
    id: 'EsriWorldShadedRelief',
    name: 'ESRI World Hillshade',
    url:
      'https://services.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}',
    attributions:
      'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
  },
  {
    id: 'EsriWorldOcean',
    name: 'ESRI World Ocean',
    url:
      'https://services.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}',
    attributions:
      'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
  },
  {
    id: 'USGSImageryTopo',
    name: 'USGS Imagery/Topo',
    url:
      'https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer/tile/{z}/{y}/{x}',
    attributions:
      'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
  },
  {
    id: 'CartoDBDarkMatter',
    name: 'CartoDB Dark Matter',
    url:
      'https://cartodb-basemaps-{a-c}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png',
    attributions:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://cartodb.com/attributionss">CartoDB</a>',
    maxZoom: 19,
  },
  {
    id: 'CartoDBPositron',
    name: 'CartoDB Positron',
    url:
      'https://cartodb-basemaps-{a-c}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
    attributions:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://cartodb.com/attributionss">CartoDB</a>',
    maxZoom: 19,
  },
];

class BasemapControl extends Control {
  constructor(props) {
    const options = Object.assign(
      {
        basemaps: basemaps.map((b) => {
          return new XYZ({
            url: b.url,
            crossOrigin: true,
            attributions: b.attributions,
            maxZoom: b.maxZoom,
          });
        }),
        activeIdx: 0,
      },
      props
    );

    const layer = new Tile({
      source: options.basemaps[options.activeIdx],
    });

    var select = document.createElement('select');
    basemaps.forEach((b, i) => {
      const opt = document.createElement('option');
      opt.value = i;
      opt.text = b.name;
      select.appendChild(opt);
    });
    select.value = options.activeIdx;

    var element = document.createElement('div');
    element.className = 'basemap-control';
    element.appendChild(select);

    super({
      element: element,
      target: options.target,
    });

    this.options = options;
    this.layer = layer;
    this.setBasemap = this.setBasemap.bind(this);

    select.addEventListener('change', (e) => {
      this.setBasemap(Number(e.target.value));
    });
  }

  setMap(map) {
    super.setMap(map);
    this.setBasemap(0);
  }

  setBasemap(idx) {
    const map = this.getMap();
    map.removeLayer(this.layer);
    this.layer.setSource(this.options.basemaps[idx]);
    map.getLayers().insertAt(0, this.layer);
  }
}

export default BasemapControl;
