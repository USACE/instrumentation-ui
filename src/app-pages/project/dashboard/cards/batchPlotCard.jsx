import React from 'react';
import { connect } from 'redux-bundler-react';
import { SsidChart } from '@mui/icons-material';

import Card from '../../../../app-components/card';
import Link from '../../../../app-components/link';

import '../../project.scss';

const createReportRow = (project, plot) => {
  const { name, id } = plot;

  return (
    <div className='report-row' key={id}>
      <SsidChart fontSize='inherit' />
      <Link to={`/${project.slug}#batch-plotting?c=${id}`}>{name}</Link>
    </div>
  );
};

const BatchPlotCard = connect(
  'selectProjectsByRoute',
  'selectBatchPlotConfigurationsItems',
  ({
    projectsByRoute: project,
    batchPlotConfigurationsItems: plots,
  }) => (
    <Card className='mt-3'>
      <Card.Header text='Batch Plots' />
      <Card.Body hasPaddingVertical={false} className='pt-2'>
        {plots.length ? (
          <div className='pb-3'>
            {plots.map((plot, i) => {
              if (i < 5) return createReportRow(project, plot);
            })}
          </div>
        ) : (
          <p>
            Create <Link to={`/${project.slug}#batch-plotting`}>new batch plot configurations</Link> to view recent configurations here.
          </p>
        )}
      </Card.Body>
    </Card>
  )
);

export default BatchPlotCard;
