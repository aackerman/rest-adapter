import BaseAdapter from './BaseAdapter';

class FetchAdapter extends BaseAdapter {
  request(url, type, options = {}) {
    let beforeSend = options.beforeSend || this.beforeSend || function(){};
    let hash = this.requestOptions(url, type, options);

    // allow the consumer to mutate the hash before sending
    beforeSend(hash);
    return fetch(url, hash).then((response) => {
      // determine if the status is acceptable
      if (response.status >= 200 && response.status < 300) {
        return response;
      } else {
        var error = new Error(response.statusText);
        error.response = response;
        this.onReject(error);
        throw error;
      }
    }).then(response => response.json());
  }

  requestOptions(url, type, options) {
    var hash = options || {};
    hash.method = type;
    hash.credentials = 'same-origin';

    if (hash.body && type !== 'GET') {
      hash.headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
      };
      hash.body = JSON.stringify(options.body);
    }

    return hash;
  }
}

export default FetchAdapter;
