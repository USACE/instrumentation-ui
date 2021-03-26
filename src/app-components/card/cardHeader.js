import React from 'react';

import { classArray } from '../../utils';

import './cardHeader.scss';

/**
 * @param {Node} children - Child Node 
 */
const CardHeader = ({
  children,
  ...customProps
}) =>  {
  const cardHeaderClasses = classArray([
    'app-card-header',
    customProps.className,
  ]);

  return (
    <p className={cardHeaderClasses}>
      {children}
    </p>
  );
};

export default CardHeader;
