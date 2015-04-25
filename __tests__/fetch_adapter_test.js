import FetchAdapter from '../fetch_adapter';

describe('FetchAdapter', function(){
  var adapter = new FetchAdapter({
    namespace: 'test'
  });

  describe('find', function(){
    it('returns success', (done) => {
      adapter.find('200').then((res) => {
        expect(res).toEqual({});
        done();
      });
    });

    it('returns failure', (done) => {
      adapter.find('301').then((res) => {
        expect(res).toEqual({});
        done();
      });
    });
  });
});
