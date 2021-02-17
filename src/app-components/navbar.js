import React from 'react';
import { connect } from 'redux-bundler-react';
import { classnames } from '../utils';
import Dropdown from './dropdown';
import RoleFilter from './role-filter';

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
    if (hidden) return null;
    const handleClick = (e) => {
      if (handler && typeof handler === 'function') handler(e);
    };
    const cls = classnames({
      pointer: true,
      'nav-item': true,
      active: pathname.indexOf(href) !== -1 && href !== '/',
    });
    if (href) {
      return (
        <li className={cls}>
          <a className='nav-link' href={href}>
            {children}
          </a>
        </li>
      );
    }
    if (handler) {
      return (
        <li className={cls} onClick={handleClick}>
          <span className='nav-link'>{children}</span>
        </li>
      );
    }
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
    const navClass = classnames({
      navbar: true,
      'fixed-top': fixed,
      'navbar-expand-lg': true,
      'navbar-dark':
        theme === 'primary' || theme === 'dark' || theme === 'transparent',
      'bg-primary': theme === 'primary',
      'bg-dark': theme === 'dark',
      'bg-transparent': theme === 'transparent',
      'navbar-light': theme === 'light',
      'bg-light': theme === 'light',
    });

    const isReportingActive = project && [
      `/${project.slug}/batch-plotting`
    ].some(path => pathname.indexOf(path) !== -1);

    return (
      <nav className={navClass}>
        {hideBrand ? null : (
          <span className='navbar-brand'>
            <strong>
              <a href='/' className='text-white'>
                <i className='mdi mdi-pulse pr-2'></i>
                {brand || 'Home'}
              </a>
            </strong>
            {project && project.name && (
              <>
                <i className='mdi mdi-chevron-right pl-2 pr-2' />
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
                <NavItem href={`/${project.slug}/manager`}>
                  Inventory Manager
                </NavItem>
                <NavItem href={`/${project.slug}/explore`}>
                  Explorer
                </NavItem>
                <RoleFilter allowRoles={[`${project.slug.toUpperCase()}.*`]}>
                  <NavItem href={`/${project.slug}/upload`}>Uploader</NavItem>
                </RoleFilter>
                <Dropdown.Menu
                  dropdownClasses={[`nav-item pointer${isReportingActive ? ' active': '' }`]}
                  menuClasses={['dropdown-menu-right']}
                  customContent={<span className='nav-link'>Reporting</span>}
                >
                  <Dropdown.Item href={`/${project.slug}/batch-plotting`}>Batch Plotting</Dropdown.Item>
                </Dropdown.Menu>
              </>
            ) : null}
            {window.location.pathname === '/instrumentation/help' ? (
              <NavItem href='/'>Home</NavItem>
            ) : (
              <NavItem href='/help'>Help</NavItem>
            )}
            {authIsLoggedIn ? (
              <ProfileMenu />
            ) : (
              <NavItem handler={doAuthLogin}>Login</NavItem>
            )}
          </ul>
        </div>
      </nav>
    );
  }
);

export default Navbar;
