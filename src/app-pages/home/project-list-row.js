import React from 'react';

import Button from '../../app-components/button';
import Icon from '../../app-components/icon';

const ProjectListRow = ({ project }) => {
  const { title, subtitle, href, instrumentCount, instrumentGroupCount } = project;

  return (
    <tr>
      <td className='pt-3'>
        <a href={href}>
          {title}
        </a>
        <span className='text-muted'>&nbsp;- {subtitle}</span>
      </td>
      <td className='text-primary'>{instrumentCount}</td>
      <td className='text-primary'>{instrumentGroupCount}</td>
      <td>
        <Button
          size='small'
          icon={<Icon icon='star-outline' />}
          variant='dark'
          isOutline
          isDisabled
        />
      </td>
    </tr>
  );
};

ProjectListRow.Heading = () => (
  <thead>
    <tr>
      <th>Project Name</th>
      <th>Instrument Count</th>
      <th>Instrument Group Count</th>
      <th>Tools</th>
    </tr>
  </thead>
);

export default ProjectListRow;
