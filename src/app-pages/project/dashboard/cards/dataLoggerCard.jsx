import React from 'react';
import { connect } from 'redux-bundler-react';

import Badge from '../../../../app-components/badge';
import Button from '../../../../app-components/button';
import Card from '../../../../app-components/card';
import RoleFilter from '../../../../app-components/role-filter';
import Table from '../../../../app-components/table';

import '../../project.scss';

const errorCountSort = (rowA, rowB) => {
  const { errors: errorsA } = rowA?.original || {};
  const { errors: errorsB } = rowB?.original || {};

  return errorsA?.length - errorsB?.length;
};

const NoDataLoggersDisplay = ({ doUpdateRelativeUrl, project }) => (
  <div className='m-3'>
    No Data Loggers in this project.
    <br />
    <RoleFilter allowRoles={[`${project.slug.toUpperCase()}.ADMIN`]}>
      <span className='mt-3 d-inline-block'>
        Navigate to the Data Loggers Tab to add new Data Loggers using the following button.
      </span>
      <Button
        isOutline
        size='small'
        variant='info'
        text='Navigate to Data Loggers'
        className='mt-2 d-block'
        handleClick={() => doUpdateRelativeUrl(`/${project.slug}#data-loggers`)}
      />
    </RoleFilter>
  </div>
);

const DataLoggerCard = connect(
  'doUpdateRelativeUrl',
  'selectProjectsByRoute',
  'selectProjectDataLoggers',
  ({
    doUpdateRelativeUrl,
    projectsByRoute: project,
    projectDataLoggers,
  }) => (
    <Card className='dashboard-card mt-3'>
      <Card.Header>
        <div className='dashboard-card-header'>
          <b>
            Data Loggers
            <Badge type='pill' variant='secondary' text={projectDataLoggers.length} className='ml-2'/>
          </b>
        </div>
      </Card.Header>
      <Card.Body className='mx-2 my-1' hasPaddingVertical={false} hasPaddingHorizontal={false}>
        {projectDataLoggers.length ? (
          <Table
            className='dashboard-table'
            data={projectDataLoggers}
            columns={[{
              key: 'name',
              header: 'Name',
              isSortable: true,
              render: (data) => (
                <a href={`/${project.slug}#data-loggers?id=${data.id}`}>{data.name}</a>
              ),
            }, {
              key: 'errorCount',
              isSortable: true,
              isRightAlign: true,
              header: 'Errors',
              sortingFn: (rowA, rowB) => errorCountSort(rowA, rowB),
              render: (data) => (
                <>
                  {data?.errors?.length ? (
                    <span className='float-right text-danger'>
                      {data?.errors?.length}
                    </span>
                  ) : <span className='float-right font-italic'>none</span>}
                </>
              ),
            }]}
          />
        ) : <NoDataLoggersDisplay doUpdateRelativeUrl={doUpdateRelativeUrl} project={project} />}
      </Card.Body>
    </Card>
  )
);

export default DataLoggerCard;
