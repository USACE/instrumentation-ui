import React from 'react';

import CardBody from './cardBody';
import CardHeader from './cardHeader';
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
    'app-card',
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
Card.Header = CardHeader;

export default Card;
