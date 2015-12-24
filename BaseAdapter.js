import jQuery from 'jquery';
import {
  isPlainObject,
  isNumber,
  isString,
  isUndefined
} from './helpers';

const EmptyFunction = () => {};
const HTTP_GET = 'GET';
const HTTP_POST = 'POST';
const HTTP_PUT = 'PUT';
const HTTP_DELETE = 'DELETE';

class Adapter {
  constructor(options = {}) {
    this.namespace  = options.namespace;
    this.host       = options.host;
    this.beforeSend = options.beforeSend || EmptyFunction;
    this.onReject   = options.onReject || EmptyFunction;
  }

  request(url, type, options) {
    throw new Error('Subclass must implement `request` method');
  }

  urlPrefix(path, parentURL) {
    var host = this.host;
    var namespace = this.namespace;
    var url = [];

    if (path) {
      // Absolute path
      if (path.charAt(0) === '/') {
        if (host) {
          path = path.slice(1);
          url.push(host);
        }
      // Relative path
      } else if (!/^http(s)?:\/\//.test(path)) {
        url.push(parentURL);
      }
    } else {
      if (host) { url.push(host); }
      if (namespace) { url.push(namespace); }
    }

    if (path) {
      url.push(path);
    }

    return url.join('/');
  }

  buildURL(type, id, record) {
    var url = [],
        host = this.host,
        prefix = this.urlPrefix();

    if (type) { url.push(type); }
    if (id && !Array.isArray(id)) { url.push(encodeURIComponent(id)); }
    if (prefix) { url.unshift(prefix); }

    url = url.join('/');
    if (!host && url) { url = '/' + url; }

    return url;
  }

  find(typeKey, params) {
    // find all if only type key is provided
    if ( isUndefined(params) ) {
      return this.findAll(typeKey);
    }

    // find one if a number or string id is provided
    if ( isNumber(params) || isString(params) ) {
      return this.findOne(typeKey, params);
    }

    // find by query if an object is provided
    if ( isPlainObject(params) ) {
      return this.findQuery(typeKey, params);
    }

    throw new Error('Invalid input for find', typeKey, params);
  }

  findOne(typeKey, id) {
    return this.request(this.buildURL(typeKey, id), HTTP_GET);
  }

  findAll(typeKey) {
    return this.request(this.buildURL(typeKey), HTTP_GET);
  }

  findQuery(typeKey, query) {
    return this.request(this.buildURL(typeKey), HTTP_GET, { body: query });
  }

  create(typeKey, params) {
    return this.request(this.buildURL(typeKey), HTTP_POST, { body: params });
  }

  update(typeKey, id, params) {
    return this.request(this.buildURL(typeKey, id), HTTP_PUT, { body: params });
  }

  destroy(typeKey, id) {
    return this.request(this.buildURL(typeKey, id), HTTP_DELETE);
  }
}

export default Adapter;
