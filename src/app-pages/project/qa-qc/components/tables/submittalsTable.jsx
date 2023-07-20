import React, { useEffect } from 'react';
import { connect } from 'redux-bundler-react';

import Table from '../../../../../app-components/table';
import { Circle } from '@mui/icons-material';

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
          render: (data) => (
            <Circle sx={{ color: data.submittal_status_name, fontSize: '14px', marginLeft: '12px' }} />
          ),
        }, {
          key: 'alert_config_name',
          header: 'Alert Config Name',
          isSortable: true,
        }, {
          key: 'alert_type_name',
          header: 'Alert Type Name',
          isSortable: true,
        }, {
          key: 'create_date',
          header: 'Submittal Create Date'
        }, {
          key: 'due_date',
          header: 'Submittla Due Date',
        }]}
      />
    );
  }
);

export default SubmittalsTable;
