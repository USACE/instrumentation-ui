import React from "react";

export default () => {
  return (
    <footer className="footer navbar is-fixed-bottom">
      <div className="content has-text-centered">
        <p>
          <strong>
            <i className="mdi mdi-copyright"></i>
          </strong>{" "}
          U.S. Army Corps of Engineers {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
};
