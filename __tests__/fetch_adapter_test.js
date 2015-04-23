import FetchAdapter from '../fetch_adapter';

const TEST_HOST = 'localhost:9999';

describe('FetchAdapter', function(){
  var adapter = new FetchAdapter({
    host: TEST_HOST
  });

  describe('findOne', function(){
    it('does stuff', (done) => {
      adapter.find('200').then(() => {
        done();
      }, (jqXHR, text, err) => {
        console.log(jqXHR, text, err);
      });
    });
  });
});
