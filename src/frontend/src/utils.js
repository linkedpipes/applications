export function url_domain(data) {
  var a = document.createElement("a");
  a.href = data;
  return a.hostname;
}
