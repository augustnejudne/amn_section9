const socket = io();

// REMEMBER: .on() is a listener
socket.on('connect', function() {
  console.log('Connected to server');

  socket.emit('createEmail', {
    from: 'client@test.com',
    text: 'this is from the client',
    createdAt: new Date()
  });

  socket.emit('createMessage', {
    message: 'this is the message from the client'
  });
});

socket.on('disconnect', function() {
  console.log('Disconnected from server');
});

socket.on('newEmail', function(email) {
  console.log(email);
});

socket.on('newMessage', function(message) {
  console.log('newMessage', message.message);
});

