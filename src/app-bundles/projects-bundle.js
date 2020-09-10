import createRestBundle from "./create-rest-bundle";
import { createSelector } from "redux-bundler";
import bird from "../img/florida-bird.jpg";
import dam from "../img/dam.jpg";
import moosecreek from "../img/moosecreek.png";

export default createRestBundle({
  name: "projects",
  uid: "slug",
  prefetch: true,
  staleAfter: 10000,
  persist: false,
  routeParam: "projectSlug",
  getTemplate: "/projects",
  putTemplate: "/projects/:item.id",
  postTemplate: "/projects",
  deleteTemplate: "/projects/:item.id",
  fetchActions: ["URL_UPDATED", "AUTH_LOGGED_IN"],
  forceFetchActions: ["PROJECTS_SAVE_FINISHED", "PROJECTS_DELETE_FINISHED"],
  addons: {
    selectProjectsIdByRoute: createSelector(
      "selectProjectsByRoute",
      (project) => {
        if (!project) return {};
        return {
          projectId: project.id,
        };
      }
    ),
    selectProjectsItemsWithLinks: createSelector(
      "selectProjectsItems",
      (projects) => {
        return projects.map((p) => {
          return {
            img:
              p.name.indexOf("Moose Creek") !== -1
                ? moosecreek
                : p.name.indexOf("Dam") !== -1
                ? dam
                : bird,
            title: p.name,
            subtitle: "Instrumentation Browser",
            href: `/${p.slug}/manager`,
            content: "",
          };
        });
      }
    ),
  },
});
