import { toast } from 'react-toastify';

const notificationBundle = {
  name: 'notification',

  doNotificationFire: (options) => () => {
    const { title, message, ...rest } = options;

    const str = `${title}\n\r${message}`;

    toast(str, { ...rest });
  },
};

export default notificationBundle;