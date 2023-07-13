import React from 'react';

import { classArray } from '../../common/helpers/utils';

/**
 * 
 * @param {String} variant - Sets the style of badge. One of `['primary'|'secondary'|'success'|'danger'|'warning'|'info'|'light'|'dark']`. Defaults to `primary`.
 * @param {String} type - Set the type of badge. One of `['default'|'pill']`. Defaults to `default`.
 * @param {String} text - Text displayed in the badge.
 * @returns Badge
 */
const Badge = ({
  variant = 'primary',
  type = 'default',
  text = '',
  className = '',
  ...customProps
}) => {
  const classes = classArray([
    'badge',
    type === 'pill' && 'badge-pill',
    `badge-${variant}`,
    className,
  ]);

  return (
    <span {...customProps} className={classes}>
      {text}
    </span>
  );
};

export default Badge;
