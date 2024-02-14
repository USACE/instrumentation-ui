import { asString } from 'ol/color';
import Fill from 'ol/style/Fill';
import Icon from 'ol/style/Icon';
import Layer from 'ol/layer/Vector';
import Source from 'ol/source/Vector';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import Text from 'ol/style/Text';

import { icons } from '@iconify-json/mdi';
import { getIconData, iconToSVG, iconToHTML, replaceIDs } from '@iconify/utils';

export const STATUS_COLORS = {
  active: [67, 172, 106, 1],
  lost: [208, 128, 2, 1],
  inactive: [136, 136, 136, 1],
  abandoned: [136, 136, 136, 1],
  destroyed: [136, 136, 136, 1],
  selected: [21, 71, 158, 1],
};

export const defaultLayer = new Layer({
  source: new Source(),
  declutter: false,
});

export const genIconSourceSvg = (typeId, types, color) => {
  const { description: icon } = types ? types.find(el => el.id === typeId) : {};

  // Get content for icon
  const iconData = getIconData(icons, icon);
  if (!iconData) {
    // eslint-disable-next-line no-console
    console.log(`test: "${icon}" is missing.`);
    return '';
  }

  const renderData = iconToSVG(iconData, {
    height: '18px',
    width: '18px',
  });

  const svg = iconToHTML(replaceIDs(renderData.body), {
    ...renderData.attributes,
    color: asString(color),
  });

  return svg;
};

export const createIconStyle = ({ feature, instrumentTypes, imageOpts = {}, textOpts = {}, styleOpts = {} }) => {
  const { status, ...rest } = imageOpts;

  const color = STATUS_COLORS[status || feature.getProperties()['status']];

  return new Style({
    image: new Icon({
      opacity: 1,
      color: color,
      src: `data:image/svg+xml;utf8,${genIconSourceSvg(feature.getProperties()['type_id'], instrumentTypes, color)}`,
      ...rest,
    }),
    text: new Text({
      fill: new Fill({
        color: status === 'selected' ? '#15479e' : '#000000',
      }),
      font: '14px sans-serif',
      offsetX: 12,
      offsetY: -12,
      padding: [2, 2, 2, 2],
      stroke: new Stroke({
        color: '#ffffff',
        width: 2,
      }),
      text: feature.getProperties()['name'],
      textAlign: 'left',
      ...textOpts,
    }),
    ...styleOpts,
  })
};

export const createNewExplorerLayer = (domains) => {
  const instrumentTypes = domains['instrument_type'] || {};

  if (!instrumentTypes?.length) return defaultLayer;

  const lyr = new Layer({
    source: new Source(),
    declutter: false,
    style: (feature, _r) => createIconStyle({ feature, instrumentTypes }),
  });

  return lyr;
};