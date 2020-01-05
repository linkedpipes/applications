export default class Utils {
  /**
   * Generates a new name.
   */
  static getName(): String {
    return Date.now() + Math.random();
  }

  /**
   * Gets the base part of the URL.
   * @param {String} url A given URL.
   */
  static getBaseUrl(url): String {
    const newUrl = url ? url.match(/^(([a-z]+:)?(\/\/)?[^/]+\/).*$/)[1] : '';
    return newUrl;
  }

  static getBaseUrlConcat(url): String {
    const newUrl = url ? url.match(/^(([a-z]+:)?(\/\/)?[^/]+\/).*$/)[1] : '';
    return newUrl.substring(0, newUrl.length - 1);
  }

  static getFolderUrlFromPathUrl(url): String {
    const newUrl = url
      .split('/')
      .slice(0, -1)
      .join('/');
    return newUrl;
  }

  static getFilenameFromPathUrl(url): String {
    const newUrl = url.substring(url.lastIndexOf('/') + 1);
    return newUrl;
  }

  /**
   * Gets the last segment of the URL.
   * @param {String} url A given URL.
   */
  static getLastUrlSegment(url): String {
    return url ? url.match(/([^/]*)\/*$/)[1] : '';
  }

  static guessFileType(url: String): String {
    const ext = url.replace(/.*\./, '');
    if (ext.match(/\/$/)) return 'dir';
    if (ext.match(/(md|markdown)/)) return 'text/markdown';
    if (ext.match(/html/)) return 'text/html';
    if (ext.match(/xml/)) return 'text/xml';
    if (ext.match(/ttl/)) return 'text/turtle';
    if (ext.match(/n3/)) return 'text/n3';
    if (ext.match(/rq/)) return 'application/sparql';
    if (ext.match(/css/)) return 'text/css';
    if (ext.match(/txt/)) return 'text/plain';
    if (ext.match(/json/)) return 'application/json';
    if (ext.match(/js/)) return 'application/javascript';
    if (ext.match(/(png|gif|jpeg|tif)/)) return 'image';
    if (ext.match(/(mp3|aif|ogg)/)) return 'audio';
    if (ext.match(/(avi|mp4|mpeg)/)) return 'video';
    /* default */
    return 'text/turtle';
  }

  /**
   * Determines whether the folder URL is a valid folder URL.
   * @param {String} folder A given folder URL.
   */
  static isValidFolder(folder): Boolean {
    return /^\/(\w+\/)*\w*$/.test(folder);
  }

  /**
   * Trims a given text of the prefixed and suffixed slashes.
   * @param {String} text A given text.
   */
  static trimSlashes(text) {
    return text.replace(/^\/|\/$/g, '');
  }

  /**
   * Sorting compare function for given dates.
   * @param {*} a A given date.
   * @param {*} b A given date.
   */
  static sortByDateAsc(a: Date, b: Date) {
    return -1 * (a - b);
  }
}
