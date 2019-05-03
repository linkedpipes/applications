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

  /**
   * Determines whether the URL string is a valid URL.
   * @param {String} url A given URL.
   */
  static isValidUrl(url): Boolean {
    // Copyright (c) 2010-2013 Diego Perini, MIT licensed
    // https://gist.github.com/dperini/729294
    // see also https://mathiasbynens.be/demo/url-regex
    // modified to allow protocol-relative URLs
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
      url
    );
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
