import React, { useState } from 'react';

const ProjectCard = ({ project }) => {
  const { img, title, subtitle, href, instrument_count, instrument_group_count } = project;
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = (e) => {
    e.stopPropagation();
    e.preventDefault();

    setIsFavorite(!isFavorite);
  };

  return (
    <>
      <div className='card mb-5' style={{ maxWidth: '300px' }}>
        <button className='favorite' onClick={toggleFavorite}>
          <span
            className={`mdi ${isFavorite ? 'mdi-star gold' : 'mdi-star-outline'}`}
          />
        </button>
        {img ? (
          <img
            style={{ height: '200px', width: '100%', display: 'block' }}
            src={img}
            alt='Pretty scene associated with the project'
          />
        ) : null}

        <div className='card-body'>
          <a href={href} tabIndex={0}>
            <h5 className='card-title overflow-ellipsis mt-2'>{title}</h5>
          </a>
          <hr />
          <table>
            <tr><td><span className='badge badge-primary mr-2'>{instrument_count} </span> </td><td><h5 className='mt-2'>Instruments</h5></td></tr>
            <tr><td><span className='badge badge-primary mr-2'>{instrument_group_count} </span></td><td>{instrument_group_count === 1 ? 'Instrument Group' : 'Instrument Groups'}</td></tr>
          </table>
        </div>
      </div>
    </>
  );
};

export default ProjectCard;
