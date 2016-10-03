import assert from 'assert';
import http from 'http';
import server from '../server/index';

describe('Server', () => {
  before(function () {
    server.listen();
  });

  after(function () {
    server.close();
  });
});

describe('/', () => {
  it('should return 200', (done) => {
    http.get('http://localhost:3000', (res) => {
      assert.equal(200, res.statusCode);
      done();
    });
  });
});
