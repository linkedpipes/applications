/* eslint-disable */
function urlDomain(url) {
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

function clearCookies() {
  const cookies = document.cookie.split('; ');
  // eslint-disable-next-line no-plusplus
  for (let c = 0; c < cookies.length; c++) {
    const d = window.location.hostname.split('.');
    while (d.length > 0) {
      const cookieBase = `${encodeURIComponent(
        cookies[c].split(';')[0].split('=')[0]
      )}=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=${d.join('.')} ;path=`;
      const p = window.location.pathname.split('/');
      document.cookie = `${cookieBase}/`;
      while (p.length > 0) {
        document.cookie = cookieBase + p.join('/');
        p.pop();
      }
      d.shift();
    }
  }
}

function getQueryString(params) {
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

function replaceAll(str, search, replacement) {
  const target = str;
  return target.split(search).join(replacement);
}

function getLocation(href) {
  const l = document.createElement('a');
  l.href = href;
  return l;
}

function extractUrlGroups(url) {
  const regex = /(?:http|https):\/\/((?:[\w-]+)(?:[\w-]+)+)(?:[\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/gm;
  return url.match(regex);
}

function unixTimeConverter(UNIX_timestamp) {
  if (UNIX_timestamp === -1 || UNIX_timestamp === undefined) {
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

  const time = `${month} ${date}, ${year} ${hour}:${min.substr(
    -2
  )}:${sec.substr(-2)} `;
  return time;
}

function randDarkColor() {
  const letters = '0123456789'.split('');
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 10)];
  }
  return color;
}

const getBeautifiedVisualizerTitle = visualizerId => {
  if (visualizerId !== undefined) {
    // eslint-disable-next-line func-names no-useless-escape
    const removedUnderscore = visualizerId.replace(/_/g, ' ');
    const capitalized = removedUnderscore.replace(/\w\S*/g, txt => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
    return capitalized;
  }
  return '';
};

export default {
  randDarkColor,
  unixTimeConverter,
  replaceAll,
  getQueryString,
  getLocation,
  extractUrlGroups,
  urlDomain,
  getBeautifiedVisualizerTitle
};
