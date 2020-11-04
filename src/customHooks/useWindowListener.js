export default (event, callback) => {
  window.addEventListener(event, (e) => callback(e));

  return window.removeEventListener(event, (e) => callback(e));
}