import React, { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';
import { Add, Remove } from '@mui/icons-material';

import AlertConfigList from './components/tables/alertConfigList';
import Button from '../../../app-components/button';
import Card, { CardBody, CardHeader } from '../../../app-components/card';
import DistrictRollupModal from './components/modals/districtRollupModal';
import EvaluationList from './components/tables/evaluationList';
import SubmittalsTable from './components/tables/submittalsTable';

const QaQc = connect(
  'doModalOpen',
  'doFetchQualityControlEvaluations',
  'doFetchMissingSubmittalsByProjectId',
  ({
    doModalOpen,
    doFetchQualityControlEvaluations,
    doFetchMissingSubmittalsByProjectId,
  }) => {
    const [cardIsOpen, setCardIsOpen] = useState(false);

    useEffect(() => {
      doFetchQualityControlEvaluations();
      doFetchMissingSubmittalsByProjectId();
    }, [doFetchQualityControlEvaluations, doFetchMissingSubmittalsByProjectId]);

    return (
      <div className='container-fluid'>
        <Card>
         <CardHeader>
            <strong>Evaluation History</strong>
            <Button
              isOutline
              size='small'
              className='float-right'
              style={{ marginTop: '-3.5px' }}
              variant='info'
              text='View Rollup'
              handleClick={() => doModalOpen(DistrictRollupModal, {}, 'lg')}
            />
          </CardHeader>
          <CardBody>
            <EvaluationList />
          </CardBody>
        </Card>
        <Card className='mt-3'>
          <CardHeader text='Alert Manager' />
          <CardBody>
            <AlertConfigList />
          </CardBody>
        </Card>
        <Card className='mt-3 mb-4'>
          <CardHeader className='p-3'>
            <Button
              size='small'
              className='text-primary p-0 mr-2'
              variant='link'
              title={`${cardIsOpen ? 'Close' : 'Open'} Submittal History`}
              handleClick={() => setCardIsOpen(prev => !prev)}
              icon={cardIsOpen ? <Remove fontSize='medium' /> : <Add fontSize='medium' />}
            />
            <strong className='ml-1'>Submittal History</strong>
          </CardHeader>
          <CardBody>
            {cardIsOpen ? (
              <SubmittalsTable />
            ) : <i>Expand to see historical data...</i>}
          </CardBody>
        </Card>
      </div>
    );
  },
);

export default QaQc;
