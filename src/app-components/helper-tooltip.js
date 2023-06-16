import React from 'react';
import { Tooltip } from 'react-tooltip';

import Icon from './icon';

const HelperTooltip = ({
  id,
  place = 'top',
  content = <></>,
  className = 'pl-2 d-inline',
}) => (
  <>
    <Icon
      id={id}
      className={className}
      icon='help-circle-outline'
      style={{ fontSize: '18px' }}
    />
    <Tooltip
      anchorId={id}
      effect='solid'
      place={place}
      content={content}
    />
  </>
);

export default HelperTooltip;
