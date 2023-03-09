import React from 'react';

import { classArray } from '../../common/helpers/utils';

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
    <span {...customProps} className={cardHeaderClasses}>
      {text
        ? <strong>{text}</strong>
        : children
      }
    </span>
  );
};

export default CardHeader;
