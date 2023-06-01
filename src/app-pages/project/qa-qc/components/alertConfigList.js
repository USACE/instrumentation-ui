import React, { useEffect } from 'react';
import { connect } from 'redux-bundler-react';

import AlertConfigDetailModal from './modals/alertConfigDetailModal';
import Button from '../../../../app-components/button/button';
import Icon from '../../../../app-components/icon';
import Table from '../../../../app-components/table';
import RoleFilter from '../../../../app-components/role-filter';
import NewAlertConfigModal from './modals/newAlertConfigModal';

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
              render: (data) => {
                const { alert_status } = data;

                return (
                  <Icon
                    icon='circle'
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
            }
          ]}
        />
      </div>
    );
  },
);

export default AlertConfigList;
