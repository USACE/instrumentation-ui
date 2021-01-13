import React, { createContext, useRef, useState } from 'react';
import useOutsideEventHandle from '../customHooks/useOutsideEventHandle';

const defaultVal = { closeDropdown: () => {}};
const DropdownContext = createContext(defaultVal);

const DropdownItem = ({
  onClick = () => { },
  href = null,
  className = '',
  children = null,
}) => (
  <DropdownContext.Consumer>
    {({ closeDropdown }) => (
      href
        ? <a className={`dropdown-item text-primary ${className}`} href={href}>{children}</a>
        : (
          <button 
            className={`dropdown-item text-primary ${className}`}
            onClick={(e) => {
              closeDropdown();
              onClick(e);
            }}
          >
            {children}
          </button>
        )
    )}
  </DropdownContext.Consumer>
  
);

const Dropdown = ({
  id = 'dropdown',
  dropdownClasses = [],
  buttonClasses = [],
  menuClasses = [],
  withToggleArrow = true,
  buttonContent = null,
  customContent = null,
  children = null,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const dropdownClass = ['dropdown', ...dropdownClasses].join(' ');
  const buttonClass = ['btn', withToggleArrow && 'dropdown-toggle', ...buttonClasses].join(' ');
  const menuClass = ['dropdown-menu', isOpen && 'show', ...menuClasses].join(' ');

  useOutsideEventHandle('click', menuRef, isOpen ? () => setIsOpen(false) : () => { });

  const commonProps = {
    onClick: () => setIsOpen(!isOpen),
    'aria-haspopup': true,
    'aria-expanded': isOpen,
  };

  return (
    <DropdownContext.Provider value={{ closeDropdown: () => setIsOpen(false) }}>
      <div className={dropdownClass} id={id}>
        {customContent
          ? React.cloneElement(customContent, commonProps)
          : (
            <button className={buttonClass} type='button' id={`${id}MenuButton`} title='Toggle Dropdown' {...commonProps}>
              {buttonContent}
            </button>
          )
        }
        <div className={menuClass} aria-labelledby={`${id}MenuButton`} ref={menuRef} style={{ maxHeight: '400px', overflow: 'scroll' }}>
          {children}
        </div>
      </div>
    </DropdownContext.Provider>
  );
}

const dropdown = {
  Menu: Dropdown,
  Item: DropdownItem,
};

export default dropdown;
