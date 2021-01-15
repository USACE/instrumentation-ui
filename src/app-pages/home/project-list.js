import React, { useState, useRef } from 'react';
import { connect } from 'redux-bundler-react';

import ProjectCard from './project-card';
import FilterSelect from '../../app-components/filter-select';

const FilterItemList = ({ items, filter, setFilter, active }) => (
  <ul className='list-group'>
    {items.map((item, i) => (
      <FilterItem
        item={item}
        key={i}
        filter={filter}
        setFilter={setFilter}
        active={active}
      />
    ))}
  </ul>
);

const FilterItem = ({ item, filter, setFilter, active }) => {
  const el = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const isActive = active || item.abbr === filter;

  return (
    <li
      ref={el}
      onClick={(e) => {
        if (e.currentTarget === el.current) {
          e.stopPropagation();
          e.preventDefault();
          setFilter(item.abbr);
        }
      }}
      onDoubleClick={(e) => {
        if (e.currentTarget === el.current) {
          e.stopPropagation();
          e.preventDefault();
          setExpanded(!expanded);
        }
      }}
      className={`list-group-item list-group-item-action${isActive ? ' active' : ''} pointer`}
    >
      <div className='pb-2 noselect overflow-ellipsis'>
        {item.children && !!item.children.length && (
          <span onClick={() => setExpanded(!expanded)} >
            <i className={`mdi mdi-chevron-${expanded ? 'down' : 'right'} pr-2`} />
          </span>
        )}{' '}
        <span className='pr-2'>{item.abbr}</span>
        {item.abbr !== item.text && (
          <small className='text-muted'>{item.text}</small>
        )}
      </div>
      {item.children && expanded && (
        <FilterItemList
          items={item.children}
          filter={filter}
          setFilter={setFilter}
          active={isActive}
        />
      )}
    </li>
  );
};

const filters = [
  {
    abbr: 'All',
    text: 'All',
    children: [],
  },
  {
    abbr: 'LRD',
    text: 'Great Lakes and Ohio River Division',
    children: [
      {
        abbr: 'LRB',
        text: 'Buffalo District',
        children: [],
      },
      {
        abbr: 'LRC',
        text: 'Chicago District',
        children: [],
      },
      {
        abbr: 'LRE',
        text: 'Detroit District',
        children: [],
      },
      {
        abbr: 'LRH',
        text: 'Huntington District',
        children: [],
      },
      {
        abbr: 'LRL',
        text: 'Louisville District',
        children: [],
      },
      {
        abbr: 'LRN',
        text: 'Nashville District',
        children: [],
      },
      {
        abbr: 'LRP',
        text: 'Pittsburgh District',
        children: [],
      },
    ],
  },
  {
    abbr: 'MVD',
    text: 'Mississippi Valley Division',
    children: [
      {
        abbr: 'MVM',
        text: 'Memphis District',
        children: [],
      },
      {
        abbr: 'MVN',
        text: 'New Orleans District',
        children: [],
      },
      {
        abbr: 'MVR',
        text: 'Rock Island District',
        children: [],
      },
      {
        abbr: 'MVS',
        text: 'St. Louis District',
        children: [],
      },
      {
        abbr: 'MVP',
        text: 'St. Paul District',
        children: [],
      },
      {
        abbr: 'MVK',
        text: 'Vicksburg District',
        children: [],
      },
    ],
  },
  {
    abbr: 'NAD',
    text: 'North Atlantic Division',
    children: [
      {
        abbr: 'NAB',
        text: 'Baltimore District',
        children: [],
      },
      {
        abbr: 'NAU',
        text: 'Europe District',
        children: [],
      },
      {
        abbr: 'NAE',
        text: 'New England District',
        children: [],
      },
      {
        abbr: 'NAN',
        text: 'New York District',
        children: [],
      },
      {
        abbr: 'NAO',
        text: 'Norfolk District',
        children: [],
      },
      {
        abbr: 'NAP',
        text: 'Philadelphia District',
        children: [],
      },
    ],
  },
  {
    abbr: 'NWD',
    text: 'Northwestern Division',
    children: [
      {
        abbr: 'NWK',
        text: 'Kansas City District',
        children: [],
      },
      {
        abbr: 'NWO',
        text: 'Omaha District',
        children: [],
      },
      {
        abbr: 'NWP',
        text: 'Portland District',
        children: [],
      },
      {
        abbr: 'NWS',
        text: 'Seattle District',
        children: [],
      },
      {
        abbr: 'NWW',
        text: 'Walla Walla District',
        children: [],
      },
    ],
  },
  {
    abbr: 'POD',
    text: 'Pacific Ocean Division',
    children: [
      {
        abbr: 'POA',
        text: 'Alaska District',
        children: [],
      },
      {
        abbr: 'POF',
        text: 'Far East District',
        children: [],
      },
      {
        abbr: 'POH',
        text: 'Honolulu District',
        children: [],
      },
      {
        abbr: 'POJ',
        text: 'Japan Engineer District',
        children: [],
      },
    ],
  },
  {
    abbr: 'SAD',
    text: 'South Atlantic Division',
    children: [
      {
        abbr: 'SAC',
        text: 'Charleston District',
        children: [],
      },
      {
        abbr: 'SAJ',
        text: 'Jacksonville District',
        children: [],
      },
      {
        abbr: 'SAM',
        text: 'Mobile District',
        children: [],
      },
      {
        abbr: 'SAS',
        text: 'Savannah District',
        children: [],
      },
      {
        abbr: 'SAW',
        text: 'Wilmington District',
        children: [],
      },
    ],
  },
  {
    abbr: 'SPD',
    text: 'South Pacific Division',
    children: [
      {
        abbr: 'SPA',
        text: 'Albuquerque District',
        children: [],
      },
      {
        abbr: 'SPL',
        text: 'Los Angeles District',
        children: [],
      },
      {
        abbr: 'SPK',
        text: 'Sacramento District',
        children: [],
      },
      {
        abbr: 'SPN',
        text: 'San Francisco District',
        children: [],
      },
    ],
  },
  {
    abbr: 'SWD',
    text: 'Southwestern Division',
    children: [
      {
        abbr: 'SWF',
        text: 'Fort Worth District',
        children: [],
      },
      {
        abbr: 'SWG',
        text: 'Galveston District',
        children: [],
      },
      {
        abbr: 'SWL',
        text: 'Little Rock District',
        children: [],
      },
      {
        abbr: 'SWT',
        text: 'Tulsa District',
        children: [],
      },
    ],
  },
  {
    abbr: 'TAD',
    text: 'Transatlantic Division',
    children: [
      {
        abbr: 'TAM',
        text: 'Middle East District',
        children: [],
      },
    ],
  },
];

export default connect(
  'selectProjectsItemsWithLinks',
  ({ projectsItemsWithLinks: projects }) => {
    const [filter, setFilter] = useState('All');
    const [filteredProjects, setFilteredProjects] = useState(projects);

    const onChange = filteredList => {
      const filtered = projects.filter(p => filteredList.some(e => e.value === p.title));
      setFilteredProjects(filtered);
    };

    const filterList = projects ? projects.map(p => ({ value: p.title })) : {};

    return (
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-md-3'>
            <FilterItemList
              items={filters}
              filter={filter}
              setFilter={setFilter}
            />
          </div>
          <div className='col-md-9'>
            { projects.length ? (
              <>
                <div className='mb-2'>
                  <FilterSelect items={filterList} onChange={onChange} hasClearButton />
                </div>
                <div className='d-flex flex-wrap justify-content-around'>
                  {(filteredProjects.length ? filteredProjects : projects).map((proj, i) => <ProjectCard key={i} project={proj} /> )}
                </div>
              </>
            ) : <p>Loading Projects...</p> }
          </div>
        </div>
      </div>
    );
  }
);
