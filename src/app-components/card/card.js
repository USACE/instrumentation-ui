import React from 'react';

import CardBody from './cardBody';
import { classArray } from '../../utils';

import './card.scss';

/**
 * @param {string} variant - The type of Card. One of ['default', 'raised'].
 * @param {Node} children - Child Node
 */
const Card = ({
  variant = 'default',
  children,
  ...customProps
}) => {
  const cardClassNames = classArray([
    'card',
    variant,
    customProps.className,
  ]);

  return (
    <article {...customProps} className={cardClassNames}>
      {children}
    </article>
  );
};

Card.Body = CardBody;

export default Card;
