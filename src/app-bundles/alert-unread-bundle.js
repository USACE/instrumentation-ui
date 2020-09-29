import createRestBundle from "./create-rest-bundle";

export default createRestBundle({
  name: "alertUnread",
  uid: "id",
  prefetch: false,
  persist: false,
  postTemplate: "/my_alerts/:item.id/unread",
  fetchActions: [],
});
