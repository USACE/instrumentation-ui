import React from "react";

export default ({ img, title, subtitle, content, href }) => {
  return (
    <div className="box" style={{ height: "100%" }}>
      {img ? (
        <div className="card-image">
          <figure className="image is-4by3">
            <a href={href}>
              <img src={img} alt="Pretty scene associated with the project" />
            </a>
          </figure>
        </div>
      ) : null}
      <div className="card-content">
        <p className="title is-4">
          <a href={href}>{title}</a>
        </p>
        <p className="subtitle is-6">{subtitle}</p>

        <div className="content">{content}</div>
      </div>
    </div>
  );
};
