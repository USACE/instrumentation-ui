import { toast } from 'react-toastify';
import { Duration } from 'luxon';

import { tUpdateError, tUpdateSuccess } from '../common/helpers/toast-helpers';

export default {
  name: 'projectAlertConfigs',
  getReducer: () => {
    const initialState = {
      alertConfigs: [],
    };
    
    return (state = initialState, { type, payload }) => {
      switch (type) {
        case 'PORJECT_ALERT_CONFIGS_UPDATED':
          return {
            ...state,
            alertConfigs: payload,
          };
        default:
          return state;
      }
    };
  },

  selectProjectAlertConfigsRaw: (state) => state.projectAlertConfigs,
  selectProjectAlertConfigs: (state) => state.projectAlertConfigs.alertConfigs,

  doFetchProjectAlertConfigs: () => ({ dispatch, store, apiGet }) => {
    dispatch({ type: 'PROJECT_ALERT_CONFIGS_FETCH_START' });
    const { projectId } = store.selectProjectsIdByRoute();

    const url = `/projects/${projectId}/alert_configs`;

    apiGet(url, (err, body) => {
      if (err) {
        console.log('error: ', err);
      } else {
        dispatch({
          type: 'PORJECT_ALERT_CONFIGS_UPDATED',
          payload: body,
        });
      }

      dispatch({ type: 'PROJECT_ALERT_CONFIGS_FETCH_FINISHED' });
    });
  },

  doCreateProjectAlertConfigs: (formState, callback) => ({ dispatch, store, apiPost }) => {
    dispatch({ type: 'PROJECT_ALERT_CONFIGS_CREATE_START' });

    const formData = Object.keys(formState).reduce((accum, current) => {
      if (current === 'instruments') {
        const ids = formState[current].val.map(el => ({ instrument_id: el.value }));
        return {
          ...accum,
          [current]: ids,
        };
      } else if (current === 'alert_email_subscriptions') {
        const users = formState[current].val.map(el => {
          const { text, label, value, ...rest } = el;
          return rest;
        });
        return {
          ...accum,
          [current]: users,
        };
      } else if (current === 'additional_emails') {
        const emails = formState[current].val.replace(/[\s\t\n\r]*/g, '').split(',');

        if (emails && emails.length) {
          const users = emails.map(el => {
            if (!el) return null;
            return {
              'id': null,
              'user_type': null,
              'username': null,
              'email': el,
            };
          }).filter(el => el);

          return {
            ...accum,
            'alert_email_subscriptions': [...accum['alert_email_subscriptions'], ...users],
          };
        } else {
          return { ...accum };
        }
      } else if (['schedule_interval', 'warning_interval', 'remind_interval'].includes(current)) {
        const duration = formState[current].val;
        if (!duration) return { ...accum };

        return {
          ...accum,
          [current]: Duration.fromObject(duration).toISO(),
        };
      } else return {
        ...accum,
        [current]: formState[current].val,
      };
    }, {});

    const toastId = toast.loading('Creating new alert configuration...');
    const { projectId } = store.selectProjectsIdByRoute();

    const url = `/projects/${projectId}/alert_configs`;

    const { warning_interval, schedule_interval } = formData;

    if (warning_interval && Duration.fromISO(warning_interval).toMillis() > Duration.fromISO(schedule_interval).toMillis()) {
      tUpdateError(toastId, 'Failed to create alert configuration. Warning Interval timeframe exceeded schedule interval.');
    } else {
      apiPost(url, formData, (err, _body) => {
        dispatch({ type: 'PROJECT_ALERT_CONFIGS_CREATE_FINISHED' });
        if (err) {
          console.log('error: ', err);
          tUpdateError(toastId, 'Failed to create alert configuration. Try again later.');
        } else {
          tUpdateSuccess(toastId, 'Successfully created new alert configuration!');
          store.doFetchProjectAlertConfigs();
        }
        callback();
      });
    }
  },

  doDeleteProjectAlertConfig: (alertConfigId) => ({ dispatch, store, apiDelete }) => {
    dispatch({ type: 'PROJECT_ALERT_CONFIGS_DELETE_START' });
    const { projectId } = store.selectProjectsIdByRoute();

    const url = `/projects/${projectId}/alert_configs/${alertConfigId}`;

    const toastId = toast.loading('Deleting alert configuration...');

    apiDelete(url, (err, _body) => {
      if (err) {
        console.log('todo', err);
        tUpdateError(toastId, 'Failed to delete alert configuration. Try again later.');
      } else {
        tUpdateSuccess(toastId, 'Successfully deleted alert configuration!');
        store.doFetchProjectAlertConfigs();
      }
    });
  },
};
