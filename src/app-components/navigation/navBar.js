import React, { useState, useEffect } from 'react';
import { connect } from 'redux-bundler-react';

import DevBanner from './devBanner.js';
import Icon from '../icon';
import NavItem from './navItem';
import ProfileMenu from './profileMenu';
import { classArray } from '../../utils';

import './navigation.scss';

const customTheme = {
  '/': {
    theme: 'transparent',
    hideBrand: true,
  },
  '/help': {
    theme: 'transparent',
    hideBrand: true,
  },
  '/signup': {
    brand: 'Home',
  },
};

const NavBar = connect(
  'doAuthLogin',
  'selectAuthIsLoggedIn',
  'selectProjectsByRoute',
  'selectPathname',
  ({
    doAuthLogin,
    authIsLoggedIn,
    projectsByRoute: project,
    pathname,
  }) => {
    const [hideBrand, setHideBrand] = useState(false);
    const [brand, setBrand] = useState(null);
    const [theme, setTheme] = useState('primary');

    const showDevBanner = process.env.REACT_APP_DEVELOPMENT_BANNER;

    const navClass = classArray([
      'navbar',
      'navbar-expand-lg',
      'navbar-dark',
      theme !== 'transparent' ? 
        showDevBanner ? 'fixed-top-banner' : 'fixed-top'
        : showDevBanner ? 'transparent-nav-banner' : '',
      `bg-${theme}`,
    ]);

    useEffect(() => {
      const { hideBrand, brand, theme } = customTheme[pathname] || {};

      setHideBrand(hideBrand);
      setBrand(brand);
      setTheme(theme || 'primary');
    }, [pathname]);

    return (
      <>
        {showDevBanner && <DevBanner />}
        <nav className={navClass}>
          {hideBrand ? null : (
            <span className='navbar-brand'>
              <strong>
                <a href='/' className='text-white'>
                  <Icon icon='pulse' className='pr-2' />
                  {brand || 'MIDAS'}
                </a>
              </strong>
              {project && project.name && (
                <>
                  <Icon icon='chevron-right' className='px-2' />
                  <a href={`/${project.slug}#dashboard`} className='text-white'>
                    {project.name}
                  </a>
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
            <span className='navbar-toggler-icon' />
          </button>

          <div className='collapse navbar-collapse'>
            <ul className='navbar-nav mr-auto' />
            <ul className='navbar-nav'>
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
