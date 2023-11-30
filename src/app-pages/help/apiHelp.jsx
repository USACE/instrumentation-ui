import React from 'react';

import Card from '../../app-components/card/card';

const apiURL = import.meta.env.DEV
  ? 'http://localhost:8080'
  : import.meta.env.VITE_API_URL;

const ApiHelp = () => (
  <Card className='mt-2'>
    <Card.Body>
      <p>
        <strong className='pr-3'>Q:</strong>I want to view and interact with the API. Where can I find documetation for the API?
      </p>
      <p className='text-dark'>
        The API is hosted at the link below. Simply click the link to be directed towards the swagger documentation. The documentation
        is also interactable, requiring a Bearer token to authenticate and make requests with.
      </p>
      <hr />
      <div>
        <p className='text-primary'>Click the link below to view the Swagger Documentation for the API:</p>
        <a href={`${apiURL}/swagger/index.html`} target='_blank' rel='noreferrer'>{apiURL}/swagger/index.html</a>
      </div>
    </Card.Body>
  </Card>
);

export default ApiHelp;
