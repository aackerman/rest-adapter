import RestAdapter from './index';
import {
  isObjectLike
} from './helpers';

class JqueryAdapter extends RestAdapter {
  constructor(options) {
    super(options);
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
}

export default JqueryAdapter;
