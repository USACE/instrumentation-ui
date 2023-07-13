import React, { useEffect } from 'react';
import { connect } from 'redux-bundler-react';
import { DateTime } from 'luxon';
import { Circle } from '@mui/icons-material';

import AlertConfigDetailModal from './modals/alertConfigDetailModal';
import Button from '../../../../app-components/button/button';
import Table from '../../../../app-components/table';
import RoleFilter from '../../../../app-components/role-filter';
import NewAlertConfigModal from './modals/newAlertConfigModal';

const sortStatus = (rowA, rowB) => {
  const { alert_status: alert_statusA } = rowA?.original;
  const { alert_status: alert_statusB } = rowB?.original;

  const colorEnum = {
    red: 1,
    yellow: 0,
    green: -1,
  };

  return colorEnum[alert_statusA] - colorEnum[alert_statusB];
};

const AlertConfigList = connect(
  'doModalOpen',
  'doFetchProjectAlertConfigs',
  'selectProjectAlertConfigs',
  'selectProjectsByRoute',
  ({
    doModalOpen,
    doFetchProjectAlertConfigs,
    projectAlertConfigs,
    projectsByRoute: project,
  }) => {
    useEffect(() => {
      doFetchProjectAlertConfigs();
    }, [doFetchProjectAlertConfigs]);

    return (
      <div>
        <RoleFilter allowRoles={[`${project.slug.toUpperCase()}.ADMIN}`]}>
          <Button
            isOutline
            variant='success'
            size='small'
            className='mb-3'
            text='Create New Alert Config'
            handleClick={() => doModalOpen(NewAlertConfigModal, null, 'lg')}
          />
        </RoleFilter>
        <Table
          data={projectAlertConfigs}
          columns={[
            {
              key: 'alert_status',
              header: 'Status',
              isSortable: true,
              sortingFn: (rowA, rowB) => sortStatus(rowA, rowB),
              render: (data) => {
                const { alert_status } = data;

                return (
                  <Circle
                    sx={{ fontSize: '14px', margin: '0 0 2px 14px' }}
                    style={{ color: `${alert_status}` }}
                  />
                );
              },
            },
            {
              key: 'name',
              header: 'Name',
              isSortable: true,
              render: (data) => {
                const { name } = data;

                return (
                  <Button
                    className='p-0'
                    variant='link'
                    text={name}
                    handleClick={() => doModalOpen(AlertConfigDetailModal, { config: data }, 'lg')}
                  />
                );
              },
            }, {
              key: 'body',
              header: 'Body',
              isSortable: true,
            }, {
              key: 'alert_type',
              header: 'Alert Type',
              isSortable: true,
            }, {
              key: 'create_date',
              header: 'Created On',
              isSortable: true,
              render: (data) => {
                const { create_date } = data;
                const formatted = DateTime.fromISO(create_date).toFormat('LLL dd, yyyy');

                return <span>{formatted}</span>;
              },
            }
          ]}
        />
      </div>
    );
  },
);

export default AlertConfigList;
