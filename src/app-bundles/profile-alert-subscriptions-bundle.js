import createRestBundle from './create-rest-bundle';
import { createSelector } from 'redux-bundler';

export default createRestBundle({
  name: 'profileAlertSubscriptions',
  uid: 'id',
  staleAfter: 0,
  persist: false,
  getTemplate: '/my_alert_subscriptions',
  putTemplate: '/alert_subscriptions/:item.id',
  fetchActions: [
    'PROFILE_FETCH_FINISHED',
    'ALERTSUBSCRIBE_SAVE_FINISHED',
    'ALERTUNSUBSCRIBE_SAVE_FINISHED',
  ],
  forceFetchActions: [],
  addons: {
    selectProfileAlertSubscriptions: createSelector(
      'selectProfileAlertSubscriptionsItems',
      (subscriptions) => subscriptions || []
    ),
  },
});
