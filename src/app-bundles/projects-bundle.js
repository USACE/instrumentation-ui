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
  putTemplate: '/projects/:item.id',
  postTemplate: '/projects',
  deleteTemplate: '/projects/:item.id',
  fetchActions: [
    'URL_UPDATED',
    'AUTH_LOGGED_IN',
  ],
  forceFetchActions: ['PROJECTS_SAVE_FINISHED', 'PROJECTS_DELETE_FINISHED'],
  addons: {
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
          img: p.image,
          title: p.name,
          subtitle: 'Instrumentation Browser',
          href: `/${p.slug}/project#dashboard`,
          content: '',
        }))
    ),
  },
});
