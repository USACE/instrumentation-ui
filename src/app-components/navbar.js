import React from "react";
import { connect } from "redux-bundler-react";
import { classnames } from "../utils";

const NavItem = connect("selectPathname", ({ pathname, href, children }) => {
  const cls = classnames({
    "navbar-item": true,
    "is-active": pathname === href
  });
  return (
    <a className={cls} href={href}>
      {children}
    </a>
  );
});

export default ({ theme, hideBrand }) => {
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
    "is-dark": theme === "dark"
  });
  return (
    <nav className={navClass}>
      <div className="container">
        {hideBrand ? null : (
          <div className="navbar-brand">
            <a className="navbar-item" href={"/"}>
              <strong>
                <i className="mdi mdi-water pr-2"></i>HHD Instrumentation
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
          </div>
        </div>
      </div>
    </nav>
  );
};
