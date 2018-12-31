const socket = io();

// REMEMBER: .on() is a listener
socket.on('connect', function() {
  console.log('Connected to server');
});

socket.on('newMessage', (m) => console.log(m));

socket.on('disconnect', function() {
  console.log('Disconnected from server');
});

const newMessage = (message) => {
  socket.emit('newMessage', message);
};
