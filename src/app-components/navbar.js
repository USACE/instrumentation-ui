import React from "react";
import { connect } from "redux-bundler-react";
import { classnames } from "../utils";

// //<a className="navbar-item" href="/profile">
// <div className="level is-mobile">
// <div className="level-left">
//   <div className="level-item">
//     <p>
//       <strong>
//         <i className="mdi mdi-pencil pr-2"></i>Edit
//       </strong>
//       <br />
//       <small>Edit my profile information</small>
//     </p>
//   </div>
// </div>
// </div>
// </a>

const ProfileMenu = connect(
  "doAuthLogout",
  "selectAuthTokenPayload",
  ({ doAuthLogout, authTokenPayload: user }) => {
    return (
      <div className="navbar-item has-dropdown is-hoverable">
        <div className="navbar-link">My Profile</div>
        <div id="moreDropdown" className="navbar-dropdown ">
          <a className="navbar-item" href="/logout">
            <div className="level is-mobile">
              <div className="level-item">
                <p>
                  <strong>
                    <i className="mdi mdi-logout pr-2"></i>Logout
                  </strong>
                  <br />
                  <small>{`Currently logged in as ${user.name}`}</small>
                </p>
              </div>
            </div>
          </a>
        </div>
      </div>
    );
  }
);

const NavItem = connect(
  "selectPathname",
  ({ pathname, href, handler, children }) => {
    const handleClick = (e) => {
      if (handler && typeof handler === "function") handler(e);
    };
    const cls = classnames({
      pointer: true,
      "navbar-item": true,
      "is-active": pathname === href,
    });
    if (href) {
      return (
        <a className={cls} href={href}>
          {children}
        </a>
      );
    }
    if (handler) {
      return (
        <div className={cls} onClick={handleClick}>
          {children}
        </div>
      );
    }
  }
);

export default connect(
  "doAuthLogin",
  "selectAuthIsLoggedIn",
  "selectProjectsByRoute",
  ({
    doAuthLogin,
    authIsLoggedIn,
    theme,
    hideBrand,
    projectsByRoute: project,
  }) => {
    const navClass = classnames({
      navbar: true,
      "is-primary": theme === "primary",
      "is-link": theme === "link",
      "is-info": theme === "info",
      "is-success": theme === "success",
      "is-warning": theme === "warning",
      "is-danger": theme === "danger",
      "is-white": theme === "white",
      "is-black": theme === "black",
      "is-light": theme === "light",
      "is-dark": theme === "dark",
    });
    return (
      <nav className={navClass}>
        <div className="container">
          {hideBrand ? null : (
            <div className="navbar-brand">
              <a className="navbar-item" href={"/"}>
                <strong style={{ fontSize: "2em" }}>
                  <i className="mdi mdi-water pr-2"></i>
                  {project && project.name ? project.name : ""} Instrumentation
                  Browser
                </strong>
              </a>
              <span
                className="navbar-burger burger"
                data-target="navbarMenuHero2"
              >
                <span></span>
                <span></span>
                <span></span>
              </span>
            </div>
          )}
          <div className="navbar-menu">
            <div className="navbar-end">
              <NavItem href="/explore">Explorer</NavItem>
              {authIsLoggedIn ? (
                <NavItem href="/upload">Uploader</NavItem>
              ) : null}
              {authIsLoggedIn ? (
                <NavItem href="/manager">Instrument Manager</NavItem>
              ) : null}
              {authIsLoggedIn ? (
                <ProfileMenu />
              ) : (
                <NavItem handler={doAuthLogin}>Login</NavItem>
              )}
            </div>
          </div>
        </div>
      </nav>
    );
  }
);
