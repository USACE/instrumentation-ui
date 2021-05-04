import createRestBundle from './create-rest-bundle';

export default createRestBundle({
  name: 'users',
  uid: 'id',
  staleAfter: 0,
  persist: false,
  getTemplate: '/email_autocomplete',
  fetchActions: [],
  forceFetchActions: ['TYPEAHEAD_SEARCH'],
});
