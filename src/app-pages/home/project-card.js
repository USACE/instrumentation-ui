import React, { useState } from "react";

const ProjectCard = ({ project }) => {
  const { img, title, subtitle, href } = project;
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = (e) => {
    e.stopPropagation();
    e.preventDefault();

    setIsFavorite(!isFavorite);
  };

  return (
    <>
      <a href={href} tabIndex={0}>
        <div className="card mb-5" style={{ maxWidth: "300px" }}>
          <button className="favorite" onClick={toggleFavorite}>
            <span
              className={`mdi ${
                isFavorite ? "mdi-star gold" : "mdi-star-outline"
              }`}
            />
          </button>
          {img ? (
            <img
              style={{ height: "200px", width: "100%", display: "block" }}
              src={img}
              alt="Pretty scene associated with the project"
            />
          ) : null}

          <div className="card-body">
            <h5 className="card-title overflow-ellipsis">{title}</h5>
            <h6 className="card-subtitle text-muted">{subtitle}</h6>
          </div>
        </div>
      </a>
    </>
  );
};

export default ProjectCard;
