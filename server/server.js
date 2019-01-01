const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const path = require('path');

const generateMessage = require('./utils/message');

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

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the ChatApp!'));
  socket.broadcast.emit('newMessage', generateMessage('Admin', 'A new user has joined us!'));

  socket.on('createMessage', (m, callback) => {
    const msg = generateMessage(m.sender, m.text);
    console.log(msg);
    io.emit('newMessage', msg);
    // socket.broadcast.emit('newMessage', msg);
    callback('Sever has successfully received your message.');
  })
});

server.listen(process.env.PORT, () => {
  console.log('========================');
  console.log(`LISTENING ON PORT ${process.env.PORT}`);
  console.log('========================');
})
