import React from 'react';
import { connect } from 'redux-bundler-react';

import Dropdown from './dropdown';
import Icon from './icon';
import RoleFilter from './role-filter';
import { classArray } from '../utils';

const getInitials = (name = '') => {
  let initials = ['U', 'N'];
  let parts = name.split('.');
  if (parts[1] && parts[1][0]) initials[0] = parts[1][0];
  if (parts[0] && parts[0][0]) initials[1] = parts[0][0];
  return initials.join('');
};

const ProfileMenu = connect(
  'selectAuthTokenPayload',
  ({ authTokenPayload: user }) => (
    <Dropdown.Menu
      dropdownClasses={['nav-item']}
      menuClasses={['dropdown-menu-right']}
      customContent={
        <span
          style={{ border: '2px solid green', borderRadius: '2em' }}
          className='nav-link ml-2'
          id='navbarDropdownMenuLink'
          role='button'
        >
          {`${getInitials(user.name)}`}
        </span>
      }
    >
      <Dropdown.Item href='/profile'>My Profile</Dropdown.Item>
      <Dropdown.Item href='/logout'>
        Logout
        <small className='d-block'>Currently logged in as {user.name}</small>
      </Dropdown.Item>
    </Dropdown.Menu>
  )
);

const NavItem = connect(
  'selectPathname',
  ({ pathname, href, handler, children, hidden }) => {
    const cls = classArray([
      'pointer',
      'nav-item',
      pathname.indexOf(href) !== -1 && href !== '/' && 'active',
    ]);

    const handleClick = (e) => {
      if (handler && typeof handler === 'function') handler(e);
    };

    return !hidden ?
      handler ? (
        <li className={cls} onClick={handleClick}>
          <span className='nav-link'>{children}</span>
        </li>
      ) : (
        <li className={cls}>
          <a className='nav-link' href={href}>
            {children}
          </a>
        </li>
      ) : null;
  }
);

const Navbar = connect(
  'doAuthLogin',
  'selectAuthIsLoggedIn',
  'selectProjectsByRoute',
  'selectPathname',
  ({
    doAuthLogin,
    authIsLoggedIn,
    theme,
    fixed = false,
    hideBrand,
    brand = null,
    projectsByRoute: project,
    pathname,
  }) => {
    const navClass = classArray([
      'navbar',
      'navbar-expand-lg',
      fixed && 'fixed-top',
      theme === 'light' ? 'navbar-light' : 'navbar-dark',
      `bg-${theme}`,
    ]);

    const isReportingActive =
      project &&
      [`/${project.slug}/batch-plotting`].some(
        (path) => pathname.indexOf(path) !== -1
      );

    return (
      <nav className={navClass}>
        {hideBrand ? null : (
          <span className='navbar-brand'>
            <strong>
              <a href='/' className='text-white'>
                <Icon icon='pulse' className='pr-2' />
                {brand || 'Home'}
              </a>
            </strong>
            {project && project.name && (
              <>
                <Icon icon='chevron-right' className='px-2' />
                <span className='text-white default-cursor'>
                  {project.name}
                </span>
              </>
            )}
          </span>
        )}
        <button
          className='navbar-toggler'
          type='button'
          aria-expanded='false'
          aria-label='Toggle navigation'
        >
          <span className='navbar-toggler-icon'></span>
        </button>

        <div className='collapse navbar-collapse'>
          <ul className='navbar-nav mr-auto'></ul>
          <ul className='navbar-nav'>
            {project ? (
              <>
                <NavItem href={`/${project.slug}/explore`}>Explorer</NavItem>
                <NavItem href={`/${project.slug}/manager`}>
                  Inventory Manager
                </NavItem>
                <RoleFilter allowRoles={[`${project.slug.toUpperCase()}.*`]}>
                  <NavItem href={`/${project.slug}/upload`}>Uploader</NavItem>
                </RoleFilter>
                <Dropdown.Menu
                  dropdownClasses={[
                    `nav-item pointer${isReportingActive ? ' active' : ''}`,
                  ]}
                  menuClasses={['dropdown-menu-right']}
                  customContent={<span className='nav-link'>Reporting</span>}
                >
                  <Dropdown.Item href={`/${project.slug}/batch-plotting`}>
                    Batch Plotting
                  </Dropdown.Item>
                </Dropdown.Menu>
              </>
            ) : null}
            {window.location.pathname === '/instrumentation/help' ? (
              <NavItem href='/'>Home</NavItem>
            ) : (
              <NavItem href='/help'>Help</NavItem>
            )}
            <div className='mx-2'>
              {authIsLoggedIn ? (
                <ProfileMenu />
              ) : (
                <NavItem handler={doAuthLogin}>Login</NavItem>
              )}
            </div>
          </ul>
        </div>
      </nav>
    );
  }
);

export default Navbar;
