const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const path = require('path');

require('dotenv').config();

const publicPath = path.join(__dirname, '../public');
const app = express();
const server = http.createServer(app);

// We need to configure the server to ALSO use socket.io
const io = socketIO(server);

// middlewares
app.use(express.static(publicPath));

// listen for an event and do something
// 'connection' is an event that lets us listen to a connection
//    and do something when that connection comes in
// 'socket' represents the individual socket
//    as opposed to all the connected users
io.on('connection', socket => {
  console.log('New user connected');

  socket.emit('newEmail', {
    from: 'server@test.com',
    text: 'this is from the server',
    createdAt: new Date()
  });

  socket.emit('newMessage', {
    message: 'This is the message from the server'
  });

  socket.on('createEmail', (newEmail) => {
    console.log('createEmail', newEmail);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.on('createMessage', (message) => {
    console.log('createMessage:', message.message);
  });
});

server.listen(process.env.PORT, () => {
  console.log('========================');
  console.log(`LISTENING ON PORT ${process.env.PORT}`);
  console.log('========================');
})

