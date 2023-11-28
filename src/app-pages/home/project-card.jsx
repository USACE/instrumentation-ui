import React, { useState } from 'react';

import Card from '../../app-components/card';
import Link from '../../app-components/link';

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
      <Link to={href} tabIndex={0}>
        <Card className='mb-5' style={{ width: '300px' }}>
          <button className='favorite' onClick={toggleFavorite} disabled>
            <span
              className={`mdi ${
                isFavorite ? 'mdi-star gold' : 'mdi-star-outline'
              }`}
            />
          </button>
          {img ? (
            <img
              style={{ height: '200px', width: '100%', display: 'block' }}
              src={img}
              alt='Pretty scene associated with the project'
            />
          ) : null}

          <Card.Body>
            <h5 className='card-title overflow-ellipsis'>{title}</h5>
            <h6 className='card-subtitle text-muted'>{subtitle}</h6>
          </Card.Body>
        </Card>
      </Link>
    </>
  );
};

export default ProjectCard;
