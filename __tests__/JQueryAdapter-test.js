import JQueryAdapter from '../JQueryAdapter';

describe('JQueryAdapter', function(){
  var adapter = new JQueryAdapter({});

  describe('find', function(){
    it('returns success', (done) => {
      adapter.find('200').then((res) => {
        expect(res).toEqual({ ham: true });
        done();
        return null;
      });
    });

    it('returns failure', (done) => {
      adapter.find('301').then((res) => {
        expect(res).toEqual({ redirect: true });
        done();
        return null;
      });
    });

    it('fails on 400 response', (done) => {
      adapter.find('400').catch(err => {
        expect(
          JSON.parse(err.jqXHR.responseText)
        ).toEqual({ error: 400 });
        done();
        return null;
      });
    });

    it('fails on 500 response', (done) => {
      adapter.find('500').catch(err => {
        expect(
          JSON.parse(err.jqXHR.responseText)
        ).toEqual({ error: 500 });
        done();
        return null;
      });
    });
  });
});
