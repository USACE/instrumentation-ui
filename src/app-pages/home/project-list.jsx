import React, { useState, useMemo, useEffect } from 'react';
import Select from 'react-select';
import { connect } from 'redux-bundler-react';
import { createColumnHelper } from '@tanstack/react-table';
import { IconButton } from '@mui/material';
import {
  Filter,
  KeyboardArrowUp,
  KeyboardArrowDown,
  Toc,
} from '@mui/icons-material';

import Button from '../../app-components/button';
import ProjectCard from './project-card';
import Table from '../../app-components/table/table';

const sortByDistrictName = (rowA, rowB, districts) => {
  const { original: origA } = rowA;
  const { original: origB } = rowB;
  const { districtId: districtIdA } = origA;
  const { districtId: districtIdB } = origB;

  const foundA = districts.find(el => el.district_id === districtIdA)?.name;
  const foundB = districts.find(el => el.district_id === districtIdB)?.name;

  if (!foundA) return -1;
  else if (!foundB) return 1;
  else return foundB.localeCompare(foundA);
};

const mapDistrictName = (districtId, length, districts = []) => {
  if (!districts?.length || !length) return '';

  const found = districts.find(el => el.id === districtId);

  const str = (found && found?.name) ? found.name : 'No Associated District';

  return `${str}${length ? ` (${length})` : '' }`;
};

const groupProjects = (projects = []) => {
  if (!projects?.length) return [];

  const grouped = projects.reduce((accum, current) => {
    const { districtId } = current;

    const index = accum.findIndex(el => el.districtId === districtId);

    if (index >= 0) {
      accum[index] = {
        ...accum[index],
        projects: [...accum[index].projects, current],
      }
    } else {
      accum.push({
        districtId,
        projects: [current],
      })
    }

    return accum;
  }, []);

  return grouped;
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
    const [groupedProjects, setGroupedProjects] = useState(groupProjects(projects));
    const [isTableMode, setIsTableMode] = useState(true);
    const [inputString, setInputString] = useState('');
    const columnHelper = createColumnHelper();

    const columns = useMemo(
      () => [
        columnHelper.accessor('districtId', {
          header: 'District',
          id: 'districtId',
          enableColumnFilter: false,
          sortingFn: (a, b) => sortByDistrictName(a, b, districts),
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
          header: '(Not a Project) Name',
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

    useEffect(() => {
      setGroupedProjects(groupProjects(projects, districts));
    }, [projects, districts, setGroupedProjects, groupProjects]);

    useEffect(() => {
      doFetchDistricts();
    }, [doFetchDistricts]);

    return (
      <div className='container-fluid'>
        <div className='row'>
          <div className='mx-3 w-100'>
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
                      {projects.map(project => (
                        <ProjectCard key={project.id} project={project} />
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
