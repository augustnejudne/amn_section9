const { assert } = require('chai');
const generateMessage = require('./message');

describe('generate message', () => {
  it('generates a message', done => {
    const result = generateMessage('admin', 'the is the admin message');
    assert.typeOf(result, 'object');
    assert.property(result, 'sender');
    assert.property(result, 'text');
    assert.property(result, 'createdAt');
    done();
  });
})