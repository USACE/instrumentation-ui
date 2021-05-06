import React from 'react';
import { connect } from 'redux-bundler-react';

import Card from '../../app-components/card';

const MyProjects = connect(
  'selectProjectsByProfileRoles',
  ({ projectsByProfileRoles }) => (
    projectsByProfileRoles.length ? (
      <Card className='m-3'>
        <Card.Header text='My Projects' />
        <Card.Body>
          <table className='table'>
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Office</th>
                <th>Instrument Count</th>
                <th>Instrument Group Count</th>
              </tr>
            </thead>
            <tbody>
              {projectsByProfileRoles.map(project => (
                <tr key={project.id} className='m-5'>
                  <td>
                    <a href={`/${project.slug}/project#dashboard`}>{project.name}</a>
                  </td>
                  <td>{project.office_id || 'N/A'}</td>
                  <td>{project.instrument_count}</td>
                  <td>{project.instrument_group_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card.Body>
      </Card>
    ) : null
  )
);

export default MyProjects;
