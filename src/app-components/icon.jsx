import React from 'react';

import { classArray } from '../utils';

const Icon = ({
  icon = '',
  className = '',
  ...customProps
}) => {
  const classnames = classArray([
    'mdi',
    `mdi-${icon}`,
    className,
  ]);

  return (
    <i
      className={classnames}
      {...customProps}
    />
  );
};

export default Icon;
