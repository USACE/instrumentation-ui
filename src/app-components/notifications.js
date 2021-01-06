import React, { useRef, useEffect } from 'react';
import { connect } from 'redux-bundler-react';
import NotificationSystem from 'react-notification-system';

export default connect(
  'selectNotification',
  'doNotificationClear',
  ({ notification, doNotificationClear }) => {
    const notificationSystem = useRef(null);

    useEffect(() => {
      if (notification && notificationSystem.current) {
        notificationSystem.current.addNotification(notification);
        doNotificationClear();
      }
    }, [notification, doNotificationClear]);

    return <NotificationSystem ref={notificationSystem} />;
  }
);
