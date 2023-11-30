import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import { dummy } from './routes';


describe('routes', function() {

  // TODO: remove the tests for the dummy route

  it('dummy', function() {
    const req1 = httpMocks.createRequest(
        {method: 'GET', url: '/api/dummy', query: {name: 'Bob'} });
    const res1 = httpMocks.createResponse();
    dummy(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(res1._getData(), {msg: "Hi, Bob!"});
  });

});
