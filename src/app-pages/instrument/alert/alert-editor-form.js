import React, { useState, useEffect } from 'react';
import { connect } from 'redux-bundler-react';

import Button from '../../../app-components/button';

export default connect(
  'doAlertConfigsSave',
  ({ alert, doAlertConfigsSave }) => {
    const [formula, setFormula] = useState('');
    const [body, setBody] = useState('');

    useEffect(() => {
      if (alert) {
        setFormula(alert.formula);
        setBody(alert.body);
      }
    }, [alert]);

    return (
      <div>
        <form>
          <div className='form-row'>
            <div className='form-group col-md-6'>
              <label htmlFor='formula'>Formula</label>
              <textarea
                id='formula'
                className='form-control'
                value={formula}
                onChange={(e) => setFormula(e.target.value)}
                rows={6}
              />
            </div>
            <div className='form-group col-md-6'>
              <label htmlFor='body'>Body</label>
              <textarea
                id='body'
                className='form-control'
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={6}
              />
            </div>
          </div>
        </form>
        <div className='d-flex justify-content-end mt-2'>
          <Button
            variant='secondary'
            size='small'
            className='mr-1'
            text='Cancel'
            handleClick={() => console.log('Clicked the cancel button')}
          />
          <Button
            variant='success'
            size='small'
            text='Save'
            title='Save Alert Configuration'
            handleClick={() => {
              const updatedAlert = { ...alert, formula, body };
              doAlertConfigsSave(updatedAlert);
              console.log('Clicked the save button', updatedAlert);
            }}
          />
        </div>
        <div className='text-right mt-5'>
          <small>{`Last Updated at ${alert.update_date}`}</small>
        </div>
      </div>
    );
  }
);
