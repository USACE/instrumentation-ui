import createRestBundle from './create-rest-bundle';
import { createSelector } from 'redux-bundler';

export default createRestBundle({
  name: 'projects',
  uid: 'slug',
  initialFetch: true,
  staleAfter: 10000,
  persist: false,
  routeParam: 'projectSlug',
  getTemplate: '/projects',
  putTemplate: '/projects/{:item.id}',
  postTemplate: '/projects',
  deleteTemplate: '/projects/{:item.id}',
  fetchActions: ['URL_UPDATED', 'AUTH_LOGGED_IN'],
  forceFetchActions: ['PROJECTS_SAVE_FINISHED', 'PROJECTS_DELETE_FINISHED'],
  reduceFurther: (state, { type, payload }) => {
    switch (type) {
      case 'SET_CURRENT_ADMIN_PROJECTS':
        return {
          ...state,
          currentAdminProjects: payload,
        };
      default:
        return state;
    }
  },
  addons: {
    selectProjectsRaw: state => state.projects,
    selectProjectsCurrentAdmin: state => state.projects.currentAdminProjects,

    selectProjectsIdByRoute: createSelector(
      'selectProjectsByRoute',
      (project) => {
        if (!project) return {};
        return {
          projectId: project.id,
        };
      }
    ),

    selectProjectsItemsWithLinks: createSelector(
      'selectProjectsItems',
      (projects) =>
        projects.map((p) => ({
          id: p.id,
          img: p.image,
          title: p.name,
          subtitle: 'Instrumentation Browser',
          href: `/${p.slug}#dashboard`,
          content: '',
          instrumentCount: p.instrument_count,
          instrumentGroupCount: p.instrument_group_count,
          districtId: p.district_id,
          _raw: { ...p },
        }))
    ),

    /**
     * Returns a list of projects the user is in, defined by their role.
     * @param {string} role - One of ['admin', 'member']
     * @returns List of Project
     */
    doFetchCurrentAdminProjects: ({ role }) => ({ dispatch, apiGet }) => {
      dispatch({ type: 'START_FETCH_CURRENT_ADMIN_PROJECTS' });

      const uri = `/my_projects?role=${role}`;

      apiGet(uri, (err, body) => {
        if (err) {
          // eslint-disable-next-line no-console
          console.log('error: ', err);
        } else {
          dispatch({
            type: 'SET_CURRENT_ADMIN_PROJECTS',
            payload: body,
          });
        }
  
        dispatch({ type: 'FETCH_CURRENT_ADMIN_PROJECTS_FINISHED' });
      });
    },
  },
});
