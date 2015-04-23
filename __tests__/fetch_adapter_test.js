import FetchAdapter from '../fetch_adapter';

describe('FetchAdapter', function(){
  var adapter = new FetchAdapter({
    namespace: 'test'
  });

  describe('find', function(){
    it('does stuff', (done) => {
      adapter.find('200').then(() => {
        done();
      }, (jqXHR, text, err) => {
        console.log(jqXHR, text, err);
      });
    });
  });
});
