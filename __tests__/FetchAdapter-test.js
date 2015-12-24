import FetchAdapter from '../FetchAdapter';

describe('FetchAdapter', function(){
  var adapter = new FetchAdapter({});

  describe('find', function(){
    it('returns success', (done) => {
      adapter.find('200').then((res) => {
        expect(res).toEqual({ ham: true });
        done();
      });
    });

    it('returns failure', (done) => {
      adapter.find('301').then((res) => {
        expect(res).toEqual({ redirect: true });
        done();
      });
    });

    it('fails on 400 response', (done) => {
      adapter.find('400').catch(err => {
        err.response.json().then(json => {
          expect(json).toEqual({ error: 400 });
          done();
        });
      });
    });

    it('fails on 500 response', (done) => {
      adapter.find('500').catch(err => {
        err.response.json().then(json => {
          expect(json).toEqual({ error: 500 });
          done();
        });
      });
    });
  });
});
