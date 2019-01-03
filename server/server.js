const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const path = require('path');
// const fs = require('fs');
// const { inspect } = require('util');

//////////////////
// UTILS IMPORT //
//////////////////
const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const Users = require('./utils/users');
const Rooms = require('./utils/rooms');

/////////////////////
// INITIALIZATIONS //
/////////////////////
const publicPath = path.join(__dirname, '../public');
const app = express();
const server = http.createServer(app);
require('dotenv').config();

////////////////
// MIDDLEWARE //
////////////////
app.use(express.static(publicPath));

// We need to configure the server to ALSO use socket.io
const io = socketIO(server);

////////////////////////
// INITIALIZE CLASSES //
////////////////////////
const users = new Users();
const rooms = new Rooms();

// listen for an event and do something
// io is the server.
// io.on is the server eventHandler
// 'connection' is an event that lets us listen to a connection
//    and do something when that connection comes in
// 'socket' represents the individual socket
//    as opposed to all the connected users
// This eventListener fires when a new connection is made to the server
// let's see what socket is
io.on('connection', socket => {
  console.log(`${socket.id}`);
  console.log('New user connected');

  io.emit('updateRoomList', rooms.getRoomList());

  ////////////////////
  // ON CLIENT JOIN //
  ////////////////////
  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are required');
    }

    // create a room
    rooms.addRoom(params.room);

    // Join the room
    socket.join(params.room);
    users.removeUser(socket.id);
    if (!users.userExists(params.name)) {
      users.addUser(socket.id, params.name, params.room);
      io.to(params.room).emit('updateUserList', users.getUserList(params.room));
      io.emit('updateRoomList', rooms.getRoomList());
    } else {
      return callback(`${params.name} already in room.`);
    }

    // socket.emit is the socket emitter.
    // why is this here, though?
    socket.emit(
      'serverMsg',
      generateMessage('Admin', 'Welcome to the ChatApp!')
    );
    socket.broadcast
      .to(params.room)
      .emit(
        'serverMsg',
        generateMessage('Admin', `${params.name} has joined us!`)
      );

    callback();
  });

  ///////////////////////
  // ON CLIENT MESSAGE //
  ///////////////////////
  socket.on('clientMsg', m => {
    const user = users.getUser(socket.id);
    if (user && isRealString(m.text)) {
      const msg = generateMessage(user.name, m.text);
      io.to(user.room).emit('serverMsg', msg);
    }
  });

  ////////////////////////
  // ON CLIENT LOCATION //
  ////////////////////////
  socket.on('clientLocation', location => {
    const user = users.getUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        'clientLocation',
        generateLocationMessage(
          user.name,
          location.latitude,
          location.longitude
        )
      );
    }
  });

  //////////////////////////
  // ON CLIENT DISCONNECT //
  //////////////////////////
  socket.on('disconnect', () => {
    console.log('User disconnected');

    // Upon disconnecting, remove user
    const user = users.removeUser(socket.id);

    // if a user is successfully removed,
    // emit 'updateUserList' and
    // emit a 'serverMsg' informing the room that user.name has left
    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit(
        'serverMsg',
        generateMessage('Admin', `${user.name} has left.`)
      );
      // io.emit('serverMsg', generateMessage('Admin', `${user.name} has left.`));

      const usersInRoom = users.getUserList(user.room);
      if (usersInRoom.length === 0) {
        rooms.removeRoom(user.room);
        io.emit('updateRoomList', rooms.getRoomList());
      }
    }

  });
});

server.listen(process.env.PORT, () => {
  console.log('========================');
  console.log(`LISTENING ON PORT ${process.env.PORT}`);
  console.log('========================');
});
