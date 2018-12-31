const socket = io();

// REMEMBER: .on() is a listener
socket.on('connect', function() {
  console.log('Connected to server');
});

socket.on('newMessage', (m) => console.log(m));

socket.on('disconnect', function() {
  console.log('Disconnected from server');
});

socket.on('clientJoin', m => console.log(m));

socket.on('newClientJoin', m => console.log(m));

const newMessage = (message) => {
  socket.emit('newMessage', message);
};
