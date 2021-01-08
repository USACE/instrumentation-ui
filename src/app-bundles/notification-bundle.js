const notificationBundle = {
  name: 'notification',

  getReducer() {
    const initialData = {
      options: null,
    };

    return (state = initialData, { type, payload }) => {
      switch (type) {
        case 'NOTIFICATIONS_FIRE':
          return Object.assign({}, state, payload);
        case 'NOTIFICATIONS_CLEAR':
          return Object.assign({}, state, { options: null });
        default:
          return state;
      }
    };
  },

  doNotificationFire: (options) => ({ dispatch }) => {
    dispatch({ type: 'NOTIFICATIONS_FIRE', payload: { options } });
  },

  doNotificationClear: () => ({ dispatch }) => {
    dispatch({ type: 'NOTIFICATIONS_CLEAR' });
  },

  selectNotification: (state) => {
    return state.notification.options;
  },
};

export default notificationBundle;
