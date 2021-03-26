import React from 'react';

import { classArray } from '../../utils';

import './cardHeader.scss';

/**
 * @param {string} text - Optionally provide text to be placed in the heading, styled appropriately. Overrides any children node
 * @param {Node} children - Child Node 
 */
const CardHeader = ({
  text = '',
  children,
  ...customProps
}) =>  {
  const cardHeaderClasses = classArray([
    'app-card-header',
    customProps.className,
  ]);

  return (
    <p {...customProps} className={cardHeaderClasses}>
      {text
        ? <strong>{text}</strong>
        : children
      }
    </p>
  );
};

export default CardHeader;
