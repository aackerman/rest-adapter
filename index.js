import {
  isPlainObject,
  isNumber,
  isString,
  isUndefined,
  isObjectLike
} from './helpers';

const EmptyFunction = function(){};
const HTTP_GET = 'GET';
const HTTP_POST = 'POST';
const HTTP_PUT = 'PUT';
const HTTP_DELETE = 'DELETE';

class RestAdapter {
  constructor(options = {}) {
    this.namespace        = options.namespace;
    this.host             = options.host;
    this.beforeSend       = options.beforeSend || EmptyFunction;
    this.beforeResolution = options.beforeResolution || EmptyFunction;
    this.beforeRejection  = options.beforeRejection || EmptyFunction;
  }

  request(url, type, options) {
    return new Promise((resolve, reject) => {
      var hash = this.requestOptions(url, type, options);

      hash.beforeSend = this.beforeSend;

      hash.success = (json, textStatus, jqXHR) => {
        json = this.requestSuccess(jqXHR, json);
        this.beforeResolution(json, textStatus, jqXHR);
        resolve(json);
      };

      hash.error = (jqXHR, textStatus, errorThrown) => {
        this.beforeRejection(jqXHR, textStatus, errorThrown);
        reject(this.requestError(jqXHR, jqXHR.responseText, errorThrown));
      };

      jQuery.ajax(hash);
    });
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

    if (type) { url.push(this.pathForType(type)); }
    if (id && !Array.isArray(id)) { url.push(encodeURIComponent(id)); }
    if (prefix) { url.unshift(prefix); }

    url = url.join('/');
    if (!host && url) { url = '/' + url; }

    return url;
  }

  requestSuccess(jqXHR, jsonPayload) {
    return jsonPayload;
  }

  requestError(jqXHR, responseText, errorThrown) {
    if (isObjectLike(jqXHR)) {
      jqXHR.then = null;
      if (!jqXHR.errorThrown) {
        if (typeof errorThrown === 'string') {
          jqXHR.errorThrown = new Error(errorThrown);
        } else {
          jqXHR.errorThrown = errorThrown;
        }
      }
    }

    return jqXHR;
  }

  requestOptions(url, type, options = {}) {
    var hash = Object.assign(options, {
      url: url,
      type: type,
      dataType: 'json',
      context: this
    });

    if (hash.data && type !== HTTP_GET) {
      hash.contentType = 'application/json; charset=utf-8';
      hash.data = JSON.stringify(hash.data);
    }

    return hash;
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

  pathForType(type) {
    return camelize(type);
  }

  findOne(typeKey, id) {
    return this.request(this.buildURL(typeKey, id), HTTP_GET);
  }

  findAll(typeKey) {
    return this.request(this.buildURL(typeKey), HTTP_GET);
  }

  findQuery(typeKey, query) {
    return this.request(this.buildURL(typeKey), HTTP_GET, { data: query });
  }

  create(typeKey, params) {
    return this.request(this.buildURL(typeKey), HTTP_POST, { data: params });
  }

  update(typeKey, id, params) {
    return this.request(this.buildURL(typeKey, id), HTTP_PUT, { data: params });
  }

  destroy(typeKey, id) {
    return this.request(this.buildURL(typeKey, id), HTTP_DELETE);
  }
}

export default Adapter;
