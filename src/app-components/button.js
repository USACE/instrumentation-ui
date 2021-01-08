import React from 'react';

/**
 * 
 * @param {string} size - one of `['small', 'large']` to size the button to your needs
 * @param {string} variant - one of `['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'light', 'dark', 'link']` to apply a class standard style
 * @param {string} text - text do be display on the button
 * @param {string} title - text to be read be screen readers and onHover. if not provided, text prop will be used
 * @param {string} href - a uri for the user to be taken to onClick. overrides and removes handleClick prop if provided.
 * @param {string} type - the type of the button, one of `[button, reset, submit]`. Default `button`.
 * @param {Element} icon - an icon to be displayed next to the text on the button
 * @param {boolean} isOutline - set to `true` to apply the outline styles to the button. default: `false` 
 * @param {boolean} isDisabled - set to `true` to apply the style for a disabled button. default: `false`
 * @param {Function} handleClick - function to handle user interaction. ignored if an `href` is provided
 */
const Button = ({
  size = '',
  variant = 'primary',
  text = '',
  title = '',
  href = '',
  type = 'button',
  icon = null,
  isOutline = false,
  isDisabled = false,
  handleClick = () => {},
  className = '',
  ...customProps
}) => {
  const elem = href ? 'a' : 'button';
  const classes = [
    'btn',
    size && size === 'small' ? 'btn-sm' : size === 'large' ? 'btn-lg' : '',
    `btn-${isOutline ? 'outline-' : ''}${variant}`,
    isDisabled && 'disabled not-allowed',
    className,
  ].filter(e => e).join(' ');

  const buttonProps = {
    className: classes,
    role: 'button',
    type,
    title: title || text,
    disabled: isDisabled,
    'aria-disabled': isDisabled,
    ...href ? { href: isDisabled ? null : href } : { onClick: handleClick },
    ...customProps,
  };

  const Child = () => (
    <>
      {icon}
      {icon && text && <>&nbsp;</>}
      {text}
    </>
  );

  return React.createElement(elem, buttonProps, <Child />);
};

export default Button;
