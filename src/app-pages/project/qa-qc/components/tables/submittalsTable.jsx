import React, { useState, useEffect } from 'react';
import { connect } from 'redux-bundler-react';
import { DateTime } from 'luxon';
import { Circle, Check } from '@mui/icons-material';

import Searchbar from '../../../../home/search-bar';
import Table from '../../../../../app-components/table';
import Button from '../../../../../app-components/button';

const filterItems = (filter, items) => {
  const filtered = items.filter(item => (
    Object.values(item)
      .join(' ')
      .toUpperCase()
      .indexOf(filter.toUpperCase()) !== -1
  ));

  return filtered;
};

const SubmittalsTable = connect(
  'doFetchHistoricalSubmittalsByProjectId',
  'selectSubmittalsHistory',
  'doVerifySingleSubmittals',
  ({
    doFetchHistoricalSubmittalsByProjectId,
    submittalsHistory,
    doVerifySingleSubmittals,
  }) => {
    const [filter, setFilter] = useState('');
    const [filteredSubmittals, setFilteredSubmittals] = useState(submittalsHistory);

    useEffect(() => {
      doFetchHistoricalSubmittalsByProjectId();
    }, [doFetchHistoricalSubmittalsByProjectId]);

    useEffect(() => {
      if (filter) {
        setFilteredSubmittals(filterItems(filter, submittalsHistory));
      } else {
        setFilteredSubmittals(submittalsHistory);
      }
    }, [filter, submittalsHistory, filterItems, setFilteredSubmittals]);

    return (
      <>
        <Searchbar value={filter} onChange={e => setFilter(e)} placeholder='Filter History...' />
        <Table
          usePagination
          data={filteredSubmittals}
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
          }, {
            key: 'mark_missing',
            header: <span className='d-flex justify-content-center'>Mark as Missing</span>,
            render: data => (
              <span className='d-flex justify-content-center'>
                {/* TODO: add button to mark single submittal as missing */}
                {data?.submittal_status_name === 'red' && !data?.marked_as_missing ? (
                  <Button
                    isOutline
                    size='small'
                    variant='info'
                    icon={<Check fontSize='14' />}
                    handleClick={() => doVerifySingleSubmittals(data?.id)}
                  />
                ) : null}
              </span>
            )
          }]}
        />
      </>
    );
  }
);

export default SubmittalsTable;
