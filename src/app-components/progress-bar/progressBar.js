import React from 'react';
import { classArray } from '../../utils';

import './progressBar.scss';

const ProgressBar = ({ percent, className, ...customProps }) => {
  const cls = classArray([
    'progress-bar',
    className,
  ]);

  const fillStyle = {
    width: `${percent}%`,
  };

  return (
    <div {...customProps} className={cls}>
      <div className='fill' style={fillStyle} />
    </div>
  );
};

export default ProgressBar;
