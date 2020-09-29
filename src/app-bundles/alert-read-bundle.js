import createRestBundle from "./create-rest-bundle";

export default createRestBundle({
  name: "alertRead",
  uid: "id",
  prefetch: false,
  persist: false,
  postTemplate: "/my_alerts/:item.id/read",
  fetchActions: [],
  forceFetchActions: [],
});
