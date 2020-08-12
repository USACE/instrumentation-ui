import React from "react";

export default ({ img, title, subtitle, href }) => {
  return (
    <a href={href}>
      <div class="card mb-3 mr-3" style={{ maxWidth: "300px" }}>
        {img ? (
          <img
            style={{ height: "200px", width: "100%", display: "block" }}
            src={img}
            alt="Pretty scene associated with the project"
          />
        ) : null}
        <div class="card-body">
          <h5 class="card-title overflow-ellipsis">{title}</h5>
          <h6 class="card-subtitle text-muted">{subtitle}</h6>
        </div>
      </div>
    </a>
  );
};
