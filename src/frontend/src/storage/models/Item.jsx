/**
 * Class for an arbitrary item from a solid pod
 */

/**
 * Model class for storing person's information.
 */

const getPathFromUrl = (urlString: string): string[] => {
  const url = new URL(urlString);
  return url.pathname.split('/').filter(val => val !== '');
};

const patterns = {
  editable: /\.(txt|diff?|patch|svg|asc|cnf|cfg|conf|html?|cfm|cgi|aspx?|ini|pl|py|md|css|cs|jsx?|jsp|log|htaccess|htpasswd|gitignore|gitattributes|env|json|atom|eml|rss|markdown|sql|xml|xslt?|sh|rb|as|bat|cmd|cob|for|ftn|frm|frx|inc|lisp|scm|coffee|php[3-6]?|java|c|cbl|go|h|scala|vb|tmpl|lock|go|yml|yaml|tsv|lst|ttl)$/i,
  image: /\.(jpe?g|gif|bmp|png|svg|tiff?)$/i,
  media: /\.(mp3|ogg|wav|mp4|webm)$/i,
  video: /\.(mp4|webm|ogg)$/i,
  extractable: /\.(zip)$/i
};

export const getHumanFileSize = (byteString: string | number): string => {
  const bytes =
    typeof byteString === 'string' ? parseInt(byteString) : byteString;
  const e = Math.log(bytes) / Math.log(1e3) || 0;
  return `${+(bytes / 1e3 ** e).toFixed(2)} ${'kMGTPEZY'[e - 1] || ''}B`;
};

export class Item {
  name: string;

  path: [string];

  url: string;

  size: string;

  constructor(url: string, size: string) {
    const path = getPathFromUrl(url);

    this.name = path.pop() || '';
    this.path = path;
    this.url = url;
    this.size = size;
  }

  getDisplayName() {
    return decodeURI(this.name);
  }

  getDisplaySize() {
    return this.size ? getHumanFileSize(this.size) : 'Unknown size';
  }
}

export class FileItem extends Item {
  isImage() {
    return patterns.image.test(this.name);
  }

  isMedia() {
    return patterns.media.test(this.name);
  }

  isEditable() {
    return patterns.editable.test(this.name);
  }

  isExtractable() {
    return patterns.extractable.test(this.name);
  }

  isVideo() {
    return patterns.video.test(this.name);
  }
}

export class FolderItem extends Item {}
