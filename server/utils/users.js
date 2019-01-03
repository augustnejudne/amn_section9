const _ = require('lodash');

class Users {
  constructor() {
    this.users = [];
  }

  addUser(id, name, room) {
    const user = { id, name, room };
    this.users.push(user);
    return user;
  }

  removeUser(id) {
    return _.remove(this.users, (o) => o.id === id)[0];
  }

  getUser(id) {
    return _.find(this.users, (o) => o.id === id);
  }

  userExists(name) {
    if (_.find(this.users, (o) => o.name === name)) {
      return true;
    }
  }

  getUserList(room) {
    const usersFiltered = _.filter(this.users, (o) => o.room === room);
    const names = usersFiltered.map((o) => o.name);

    return names;
  }

  removeAll() {
    this.users = [];
  }
}

module.exports = Users;
