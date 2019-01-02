const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const path = require('path');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const Users = require('./utils/users');

require('dotenv').config();

const publicPath = path.join(__dirname, '../public');
const app = express();
const server = http.createServer(app);

// We need to configure the server to ALSO use socket.io
const io = socketIO(server);

const users = new Users();

// middlewares
app.use(express.static(publicPath));

// listen for an event and do something
// 'connection' is an event that lets us listen to a connection
//    and do something when that connection comes in
// 'socket' represents the individual socket
//    as opposed to all the connected users
io.on('connection', socket => {
  console.log('New user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');

    const user = users.removeUser(socket.id);

    if (user) {
      console.log(user);
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('serverMsg', generateMessage('Admin', `${user.name} has left.`));
      // io.emit('serverMsg', generateMessage('Admin', `${user.name} has left.`));
    }

  });

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are required');
    }
    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));

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

  socket.on('clientMsg', m => {
    const msg = generateMessage(m.sender, m.text);
    console.log(msg);
    io.emit('serverMsg', msg);
    // socket.broadcast.emit('newMessage', msg);
    // callback('Sever has successfully received your message.');
  });

  socket.on('clientLocation', location => {
    io.emit(
      'clientLocation',
      generateLocationMessage('Admin', location.latitude, location.longitude)
    );
  });
});

server.listen(process.env.PORT, () => {
  console.log('========================');
  console.log(`LISTENING ON PORT ${process.env.PORT}`);
  console.log('========================');
});
