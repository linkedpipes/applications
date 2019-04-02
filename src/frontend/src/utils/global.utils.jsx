/* eslint-disable camelcase */
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

export function extractUrlGroups(url) {
  const regex = /(?:http|https):\/\/((?:[\w-]+)(?:[\w-]+)+)(?:[\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/gm;
  return url.match(regex);
}

export function unixTimeConverter(UNIX_timestamp) {
  if (UNIX_timestamp === -1) {
    return '-';
  }
  const a = new Date(UNIX_timestamp * 1000);
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];
  const year = a.getFullYear();
  const month = months[a.getMonth()];
  const date = a.getDate();
  const hour = a.getHours();
  const min = `0${a.getMinutes()}`;
  const sec = `0${a.getSeconds()}`;

  const time = `${hour}:${min.substr(-2)}:${sec.substr(
    -2
  )} ${date} ${month} ${year}`;
  return time;
}
