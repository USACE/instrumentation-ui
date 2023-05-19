import React from 'react';
import { connect } from 'redux-bundler-react';
import { DateTime } from 'luxon';

import Table from '../../../../app-components/table';
import Button from '../../../../app-components/button/button';
import NewEvaluationModal from './modals/newEvaluationModal';

const EvaluationList = connect(
  'doModalOpen',
  'selectQualityControlEvaluations',
  ({
    doModalOpen,
    qualityControlEvaluations,
  }) => {
    console.log('evaluations: ', qualityControlEvaluations);

    return (
      <div>
        <Button
          isOutline
          variant='success'
          size='small'
          className='mb-3'
          text='Submit New Evaluation'
          handleClick={() => doModalOpen(NewEvaluationModal, null, 'lg')}
        />
        <Table
          data={qualityControlEvaluations}
          columns={[
            {
              key: 'name',
              header: 'Name',
              isSortable: true,
            }, {
              key: 'body',
              header: 'Body',
              isSortable: true,
            }, {
              key: 'create_date',
              header: 'Evaluation Date',
              isSortable: true,
              render: (data) => {
                const { create_date } = data;
                const formatted = DateTime.fromISO(create_date).toFormat('LLL dd, yyyy');

                return <span>{formatted}</span>;
              },
            }, {
              key: 'timerange',
              header: 'Dataset Date Range',
              render: (data) => {
                const { end_date, start_date } = data;
                const formattedStart = DateTime.fromISO(start_date).toFormat('LLL dd, yyyy');
                const formattedEnd = DateTime.fromISO(end_date).toFormat('LLL dd, yyyy');

                return <span>{formattedStart} - {formattedEnd}</span>;
              },
            }
          ]}
        />
      </div>
    );
  },
);

export default EvaluationList;
