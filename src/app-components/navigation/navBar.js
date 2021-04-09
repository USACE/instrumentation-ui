import React from 'react';
import { connect } from 'redux-bundler-react';

import Dropdown from './dropdown';
import Icon from './icon';
import RoleFilter from './role-filter';
import { classArray } from '../utils';

const NavBar = connect(
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
      <>
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
              {window.location.pathname === '/help' ? (
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
      </>
    );
  }
);

export default NavBar;
