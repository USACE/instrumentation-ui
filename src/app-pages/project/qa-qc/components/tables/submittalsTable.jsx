import React, { useEffect } from 'react';
import { connect } from 'redux-bundler-react';

import Table from '../../../../../app-components/table';
import { Circle } from '@mui/icons-material';
import { DateTime } from 'luxon';

const SubmittalsTable = connect(
  'doFetchHistoricalSubmittalsByProjectId',
  'selectSubmittalsHistory',
  ({
    doFetchHistoricalSubmittalsByProjectId,
    submittalsHistory,
  }) => {
    useEffect(() => {
      doFetchHistoricalSubmittalsByProjectId();
    }, [doFetchHistoricalSubmittalsByProjectId]);

    return (
      <Table
        usePagination
        data={submittalsHistory}
        columns={[{
          key: 'submittal_status_name',
          header: 'Status',
          render: data => (
            <Circle sx={{ color: data.submittal_status_name, fontSize: '14px', marginLeft: '12px' }} />
          ),
        }, {
          key: 'alert_config_name',
          header: 'Alert Configuration Name',
          isSortable: true,
        }, {
          key: 'alert_type_name',
          header: 'Alert Type',
          isSortable: true,
        }, {
          key: 'create_date',
          header: 'Submittal Create Date',
          render: data => (
            <span>{DateTime.fromISO(data?.create_date).toFormat('MMM dd, yyyy HH:mm:ss')}</span>
          ),
        }, {
          key: 'due_date',
          header: 'Submittal Due Date',
          render: data => (
            <span>{DateTime.fromISO(data?.due_date).toFormat('MMM dd, yyyy HH:mm:ss')}</span>
          ),
        }]}
      />
    );
  }
);

export default SubmittalsTable;
