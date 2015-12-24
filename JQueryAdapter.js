import jQuery from 'jquery';
import BaseAdapter from './BaseAdapter';

class JQueryAdapter extends BaseAdapter {
  request(url, type, options) {
    return new Promise((resolve, reject) => {
      var hash = this.requestOptions(url, type, options);

      hash.beforeSend = this.beforeSend;
      hash.success = resolve;
      hash.error = (jqXHR, textStatus, errorThrown) => {
        var error = new Error(textStatus);
        error.jqXHR = jqXHR;
        return reject(error);
      };

      return jQuery.ajax(hash);
    });
  }

  requestOptions(url, type, options = {}) {
    var hash = Object.assign(options, {
      url: url,
      type: type,
      dataType: 'json',
      context: this
    });

    if (hash.body && type !== HTTP_GET) {
      hash.contentType = 'application/json; charset=utf-8';
      // jQuery uses data instead of a `body` argument
      hash.data = JSON.stringify(hash.body);
    }

    return hash;
  }
}

export default JQueryAdapter;
