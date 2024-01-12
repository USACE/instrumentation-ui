import React, { useState, useRef, useMemo, useEffect } from 'react';
import Select from 'react-select';
import { connect } from 'redux-bundler-react';
import { IconButton } from '@mui/material';
import {
  Filter,
  KeyboardArrowUp,
  KeyboardArrowDown,
  Toc,
} from '@mui/icons-material';

import Button from '../../app-components/button';
import ProjectCard from './project-card';
import { filters } from './homeFilters';
import { createColumnHelper } from '@tanstack/react-table';
import Table from '../../app-components/table/table';

const mapDistrictName = (officeId, length, districts = []) => {
  if (!districts?.length || !length) return '';

  const found = districts.find(el => el.office_id === officeId);

  const str = (found && found?.name) ? found.name : 'No Associated District';

  return `${str}${length ? ` (${length})` : '' }`;
};

const groupProjects = (projects = []) => {
  if (!projects?.length) return [];

  const grouped = projects.reduce((accum, current) => {
    const { officeId } = current;

    const index = accum.findIndex(el => el.officeId === officeId);

    if (index >= 0) {
      accum[index] = {
        ...accum[index],
        projects: [...accum[index].projects, current],
      }
    } else {
      accum.push({
        officeId,
        projects: [current],
      })
    }

    return accum;
  }, []);

  return grouped;
};

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
  'doFetchDistricts',
  'selectDistricts',
  'selectProjectsItemsWithLinks',
  ({
    doUpdateRelativeUrl,
    doFetchDistricts,
    districts,
    projectsItemsWithLinks: projects,
  }) => {
    const [filter, setFilter] = useState('All');
    const [groupedProjects, setGroupedProjects] = useState(groupProjects(projects));
    const [isTableMode, setIsTableMode] = useState(true);
    const [inputString, setInputString] = useState('');
    const columnHelper = createColumnHelper();

    const columns = useMemo(
      () => [
        columnHelper.accessor('officeId', {
          header: 'District',
          id: 'officeId',
          enableColumnFilter: false,
          cell: (info) => (
            <>
              {info.row.getCanExpand() && (
                <IconButton onClick={info.row.getToggleExpandedHandler()}>
                  {info.row.getIsExpanded() ? (
                    <KeyboardArrowUp />
                  ) : (
                    <KeyboardArrowDown />
                  )}
                </IconButton>
              )}
              {mapDistrictName(info.getValue(), info.row.subRows.length, districts)}
            </>
          ),
        }),
        columnHelper.accessor('title', {
          header: 'Project Name',
          id: 'title',
          enableColumnFilter: false,
          cell: (info) => (
            <a href={info?.row?.original?.href}>{info.getValue()}</a>
          ),
        }),
        columnHelper.accessor('instrumentCount', {
          header: 'Instrument Count',
          id: 'instrumentCount',
          enableColumnFilter: false,
          enableSorting: false,
        }),
        columnHelper.accessor('instrumentGroupCount', {
          header: 'Instrument Group Count',
          id: 'instrumentGroupCount',
          enableColumnFilter: false,
          enableSorting: false,
        }),
      ],
    [districts]);

    const onChange = selected => {
      const { value } = selected;

      const project = projects.find(p => p.title === value);
      
      doUpdateRelativeUrl(project.href);
    };

    const filterList = projects
      ? projects.filter(p => p.href).map(p => ({ value: p.title, label: p.title }))
      : {};

    const isProdReady = import.meta.env.VITE_DISTRICT_SELECTOR === 'true';

    useEffect(() => {
      setGroupedProjects(groupProjects(projects, districts));
    }, [projects, districts, setGroupedProjects, groupProjects]);

    useEffect(() => {
      doFetchDistricts();
    }, [doFetchDistricts]);

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
            {projects.length ? (
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
                      }
                    }}
                    onChange={onChange}
                    className='w-100'
                  />
                </div>
                <>
                  {isTableMode ? (
                    <Table
                      useExpanding
                      data={groupedProjects}
                      customColumns={columns}
                      customTableFunctions={{
                        getSubRows: (originalRow) => 
                          originalRow?.projects?.map(project => ({
                            federalId: '',
                            title: project.title,
                            instrumentCount: project.instrumentCount,
                            instrumentGroupCount: project.instrumentGroupCount,
                            href: project.href,
                          }))
                      }}
                    />
                  ) : (
                    <div className='d-flex flex-wrap justify-content-around'>
                      {/* {(filteredProjects.length ? filteredProjects : projects).map((project, i) => (
                        project.instrumentCount ? <ProjectCard key={i} project={project} /> : null
                      ))} */}
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
