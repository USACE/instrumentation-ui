import React from 'react';
import { toast } from 'react-toastify';

const ToastBody = ({ title, message }) => (
  <>
    {title && <b>{title}</b>}
    <p className='m-0 p-0'>{message}</p>
  </>
);

const notificationBundle = {
  name: 'notification',

  doNotificationFire: (options) => () => {
    const { title, message, ...rest } = options;

    toast(<ToastBody title={title} message={message} />, { ...rest });
  },
};

export default notificationBundle;
