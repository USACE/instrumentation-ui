import React from 'react';
import { connect } from 'redux-bundler-react';

import Card from '../../../../app-components/card';
import Icon from '../../../../app-components/icon';

import '../../project.scss';

const createReportRow = (project, plot) => {
  const { create_date, update_date, name, id } = plot;

  return (
    <div className='report-row'>
      <Icon icon='file-chart' />
      <a href={`/${project.slug}/project#batch-plotting?c=${id}`}>{name}</a>
    </div>
  );
};

const ReportsCard = connect(
  'selectProjectsByRoute',
  'selectBatchPlotConfigurationsItems',
  ({
    projectsByRoute: project,
    batchPlotConfigurationsItems: plots,
  }) => (
    <Card className='mt-4'>
      <Card.Header text='Batch Plots' />
      <Card.Body className='pt-2'>
        {plots.map((plot, i) => {
          if (i < 5) return createReportRow(project, plot);
        })}
      </Card.Body>
    </Card>
  )
);

export default ReportsCard;
