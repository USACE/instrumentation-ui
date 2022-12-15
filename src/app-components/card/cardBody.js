import React from 'react';

import { classArray } from '../../utils';

import './cardBody.scss';

/**
 * @param {bool} hasPaddingVertical - procides horizontal padding to the card content. default = `true`
 * @param {bool} hasPaddingVertical - provides vertical padding to the card content. default = `true`
 * @param {bool} isContentCentered - Sets content of the card to be centered. default = `false`
 * @param {Node} children - Child Node 
 */
const CardBody = ({
  hasPaddingVertical = true,
  hasPaddingHorizontal = true,
  isContentCentered = false,
  children,
  ...customProps
}) => {
  const cardBodyClasses = classArray([
    hasPaddingVertical && 'vertical-padding',
    hasPaddingHorizontal && 'horizontal-padding',
    isContentCentered && 'center-content',
    customProps.className,
  ]);

  return <div {...customProps} className={cardBodyClasses}>{children}</div>;
};

export default CardBody;
