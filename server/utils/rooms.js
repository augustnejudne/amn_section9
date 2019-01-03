const _ = require('lodash');
class Rooms {
  constructor() {
    this.rooms = [];
  }

  addRoom(room) {
    if (!_.find(this.rooms, (r) => r.room === room)) {
      this.rooms.push({room});
    }
    return room;
  }

  removeRoom(room) {
    return _.remove(this.rooms, (o) => o.room === room)[0];
  }

  getRoomList() {
    return this.rooms.map(r => r.room);
  }
}

module.exports = Rooms;