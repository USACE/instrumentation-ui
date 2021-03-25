import React from 'react';

import Card from '../../app-components/card';

const Dashboard = () => (
  <div style={{ backgroundColor: '#eee', height: '100vh', width: '100vw'}}>
    <Card variant='raised' className='m-2'>
      <Card.Body>
        Some Content
      </Card.Body>
    </Card>
  </div>
);

export default Dashboard;
