export function urlDomain(url) {
  let hostname;
  // find & remove protocol (http, ftp, etc.) and get hostname

  if (url.indexOf('//') > -1) {
    hostname = url.split('/')[2];
  } else {
    hostname = url.split('/')[0];
  }

  // find & remove port number
  hostname = hostname.split(':')[0];
  // find & remove "?"
  hostname = hostname.split('?')[0];

  return hostname;
}

export function getQueryString(params) {
  return Object.keys(params)
    .map(k => {
      if (Array.isArray(params[k])) {
        return params[k]
          .map(val => `${encodeURIComponent(k)}[]=${encodeURIComponent(val)}`)
          .join('&');
      }

      return `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`;
    })
    .join('&');
}

export function replaceAll(str, search, replacement) {
  const target = str;
  return target.split(search).join(replacement);
}

export function getLocation(href) {
  const l = document.createElement('a');
  l.href = href;
  return l;
}

export function extractUrlGroups(url) {
  const regex = /(?:http|https):\/\/((?:[\w-]+)(?:[\w-]+)+)(?:[\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/gm;
  return url.match(regex);
}
