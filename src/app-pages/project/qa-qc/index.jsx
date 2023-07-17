import React, { useEffect } from 'react';
import { connect } from 'redux-bundler-react';

import AlertConfigList from './components/alertConfigList';
import Button from '../../../app-components/button';
import Card, { CardBody, CardHeader } from '../../../app-components/card';
import DistrictRollupModal from './components/modals/districtRollupModal';
import EvaluationList from './components/evaluationList';

const QaQc = connect(
  'doModalOpen',
  'doFetchQualityControlEvaluations',
  'doFetchMissingSubmittalsByProjectId',
  ({
    doModalOpen,
    doFetchQualityControlEvaluations,
    doFetchMissingSubmittalsByProjectId,
  }) => {
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
        <Card className='mt-3 mb-4'>
          <CardHeader text='Alert Manager' />
          <CardBody>
            <AlertConfigList />
          </CardBody>
        </Card>
      </div>
    );
  },
);

export default QaQc;
