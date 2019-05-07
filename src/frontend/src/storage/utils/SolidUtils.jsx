import * as rdflib from 'rdflib';
import { FolderItem, FileItem } from '../models';

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

  static text2graph(
    text: string,
    baseUrl: string,
    contentType: string = ''
  ): Promise<rdflib.IndexedFormula> {
    contentType = contentType || this.guessFileType(baseUrl);
    const graph = rdflib.graph();

    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, reject) => {
      rdflib.parse(text, graph, baseUrl, contentType, () => {});
      resolve(graph);
    });
  }

  static getSizeByGraph = async (
    graph: rdflib.IndexedFormula,
    subjectName: string
  ) => {
    const subjectNode = rdflib.sym(subjectName);
    const nsSize = rdflib.sym('http://www.w3.org/ns/posix/stat#size');
    const size = graph.any(subjectNode, nsSize, undefined, undefined);

    return size && 'value' in size ? size.value : undefined;
  };

  static async isFolder(
    graph: rdflib.IndexedFormula,
    baseUrl: string
  ): boolean {
    const folderNode = rdflib.sym(baseUrl);
    const isAnInstanceOfClass = rdflib.sym(
      'http://www.w3.org/1999/02/22-rdf-syntax-ns#type'
    );
    const types = graph.each(
      folderNode,
      isAnInstanceOfClass,
      undefined,
      undefined
    );
    return Object.values(types).some(
      ({ value }) => value.match('ldp#BasicContainer') !== null
    );
  }

  static getFolderItems = async (
    graph: rdflib.IndexedFormula,
    subj: string
  ) => {
    const files: FileItem[] = [];
    const folders: FolderItem[] = [];

    graph
      .each(
        rdflib.sym(subj),
        rdflib.sym('http://www.w3.org/ns/ldp#contains'),
        undefined,
        undefined
      )
      .forEach(async item => {
        const url = item.value;
        const size = this.getSizeByGraph(graph, url);

        const isFolder = await this.isFolder(graph, url);

        if (isFolder) {
          folders.push(new FolderItem(url, size));
        } else {
          files.push(new FileItem(url, size));
          files.push(new FileItem(`${url}.acl`, size));
        }
      });

    return { files, folders };
  };

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
