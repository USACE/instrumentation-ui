import React from 'react';
import { Tooltip } from 'react-tooltip';
import { HelpOutline } from '@mui/icons-material';

const HelperTooltip = ({
  id,
  place = 'top',
  content = <></>,
  className = 'pl-2 d-inline',
}) => (
  <>
    <HelpOutline
      id={id}
      className={className}
      fontSize='medium'
      sx={{ paddingBottom: '2px' }}
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
