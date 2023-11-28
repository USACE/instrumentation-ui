import React, { useState, useRef } from 'react';
import { connect } from 'redux-bundler-react';
import Select from 'react-select';
import {
  Filter,
  KeyboardArrowUp,
  KeyboardArrowDown,
  StarOutline,
  Toc,
} from '@mui/icons-material';

import Button from '../../app-components/button';
import ProjectCard from './project-card';
import Table from '../../app-components/table';
import { filters } from './homeFilters';

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
          <span onClick={() => setExpanded(!expanded)} className='pr-2'>
            {expanded ? <KeyboardArrowDown fontSize='small' /> : <KeyboardArrowUp fontSize='small' />}
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

export default connect(
  'doUpdateRelativeUrl',
  'selectProjectsItemsWithLinks',
  ({ doUpdateRelativeUrl, projectsItemsWithLinks: projects }) => {
    const [filter, setFilter] = useState('All');
    const [filteredProjects, setFilteredProjects] = useState(projects);
    const [isTableMode, setIsTableMode] = useState(true);
    const [inputString, setInputString] = useState('');

    const onInputChange = input => {
      const filtered = projects.filter(p => (p.title).toLowerCase().includes(input.toLowerCase()));
      setFilteredProjects(filtered);
    };

    const onChange = selected => {
      const { value } = selected;

      const project = projects.find(p => p.title === value);
      
      doUpdateRelativeUrl(project.href);
    };

    const filterList = projects
      ? projects.filter(p => p.instrumentCount).map(p => ({ value: p.title, label: p.title }))
      : {};

    const isProdReady = import.meta.env.VITE_DISTRICT_SELECTOR === 'true';

    return (
      <div className='container-fluid'>
        <div className='row'>
          {isProdReady && (
            <div className='col-md-3'>
              <FilterItemList
                items={filters}
                filter={filter}
                setFilter={setFilter}
              />
            </div>
          )}
          <div className={`${isProdReady ? 'col-md-9' : 'mx-3 w-100'}`}>
            { projects.length ? (
              <>
                <div className='mb-2 d-flex justify-content-between'>
                  <span className='btn-group mr-3'>
                    <Button
                      isActive={!isTableMode}
                      icon={<Filter fontSize='small' />}
                      variant='info'
                      title='Switch to Card View'
                      isOutline
                      handleClick={() => setIsTableMode(false)}
                    />
                    <Button
                      isActive={isTableMode}
                      icon={<Toc fontSize='small' />}
                      variant='info'
                      title='Switch to List View'
                      isOutline
                      handleClick={() => setIsTableMode(true)}
                    />
                  </span>
                  <Select
                    isClearable
                    options={filterList}
                    inputValue={inputString}
                    onInputChange={(value, action) => {
                      if (action.action === 'input-change') {
                        setInputString(value);
                        onInputChange(value);
                      }
                    }}
                    onChange={onChange}
                    className='w-100'
                  />
                </div>
                <>
                  {isTableMode ? (
                    <Table
                      data={filteredProjects.length ? filteredProjects : projects}
                      columns={[
                        {
                          key: 'title',
                          header: 'Project Name',
                          isSortable: true,
                          render: (data) => (
                            <>
                              <a href={data?.href}>
                                {data?.title}
                              </a>
                              <span className='text-muted'>&nbsp;- {data?.subtitle}</span>
                            </>
                          ),
                        }, {
                          key: 'instrumentCount',
                          header: 'Instrument Count',
                          isSortable: true,
                        }, {
                          key: 'instrumentGroupCount',
                          header: 'Instrument Group Count',
                          isSortable: true,
                        }, {
                          key: 'tools',
                          header: 'Tools',
                          render: (_data) => (
                            <Button
                              size='small'
                              icon={<StarOutline fontSize='small' />}
                              variant='dark'
                              isOutline
                              isDisabled
                            />
                          )
                        }
                      ]}
                    />
                  ) : (
                    <div className='d-flex flex-wrap justify-content-around'>
                      {(filteredProjects.length ? filteredProjects : projects).map((project, i) => (
                        project.instrumentCount ? <ProjectCard key={i} project={project} /> : null
                      ))}
                    </div>
                  )}
                </>
              </>
            ) : <p>Loading Projects...</p> }
          </div>
        </div>
      </div>
    );
  }
);
