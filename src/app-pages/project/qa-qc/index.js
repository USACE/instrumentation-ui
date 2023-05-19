import React, { useEffect } from 'react';
import { connect } from 'redux-bundler-react';

import Card, { CardBody, CardHeader } from '../../../app-components/card';
import EvaluationList from './components/evaluationList';

const QaQc = connect(
  'doFetchQualityControlEvaluations',
  ({
    doFetchQualityControlEvaluations,
  }) => {
    useEffect(() => {
      doFetchQualityControlEvaluations();
    }, [doFetchQualityControlEvaluations]);

    return (
      <div className='container-fluid'>
        <Card>
          <CardHeader text='QA/QC History' />
          <CardBody>
            <EvaluationList />
          </CardBody>
        </Card>
        <Card className='mt-3'>
          <CardHeader text='Alert Manager' />
          <CardBody>

          </CardBody>
        </Card>
      </div>
    );
  },
);

export default QaQc;
