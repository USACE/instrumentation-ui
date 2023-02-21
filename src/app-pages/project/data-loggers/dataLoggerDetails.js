import React from 'react';
import { DateTime } from 'luxon';

import Card from '../../../app-components/card';

const dateDisplay = date => {
  const isoDate = DateTime.fromISO(date);
  return isoDate.toLocaleString(DateTime.DATETIME_MED);
};

const DataLoggerDetails = ({ dataLogger }) => {
  const { name, sn, model, creator_username, create_date, updater_username, update_date } = dataLogger;
  
  return (
    <Card className='mt-3'>
      <Card.Body>
        <div className='row'>
          <div className='col-3'>
            <b>Name: </b>
            {name}
          </div>
          <div className='col-3'>
            <b>Serial Number: </b>
            {sn}
          </div>
          <div className='col-3'>
            <b>Model: </b>
            {model}
          </div>
        </div>
        <div className='row mt-2'>
          <i className='col-12'>
            Created by <b>{creator_username}</b> on {dateDisplay(create_date)}
          </i>
          <i className='col-12'>
            Last updated by <b>{updater_username}</b> on {dateDisplay(update_date)}
          </i>
        </div>
      </Card.Body>
    </Card>
  );
};

export default DataLoggerDetails;
