const { assert } = require('chai');
const Users = require('./users.js');

describe('Users', () => {
  const users = new Users();
  beforeEach(() => {
    users.addUser('111', 'User1', 'Room1');
    users.addUser('222', 'User2', 'Room2');
    users.addUser('333', 'User3', 'Room3');
    users.addUser('444', 'User4', 'Room4');
  });

  afterEach(() => {
    users.removeAll();
  });
  it('should add a user', () => {
    const user = {
      id: '111',
      name: 'Kim',
      room: 'NodeJS Developers'
    };

    const responseUser = users.addUser(user.id, user.name, user.room);

    assert.equal(responseUser.id, user.id);
    assert.equal(responseUser.name, user.name);
    assert.equal(responseUser.room, user.room);
  });

  it('should remove a user', () => {
    assert.lengthOf(users.users, 4);
    users.removeUser('222');
    assert.lengthOf(users.users, 3);
  });

  it('should get users by room', () => {
    assert.equal(users.getUserList('Room4')[0].name, 'User4');
  });

  it('should get user by id', () => {
    assert.equal(users.getUser('222').name, 'User2');
  });
});