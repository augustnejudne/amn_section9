const socket = io();
const $ = jQuery;

const message = $('#message');
const messages = $('#messages');

// REMEMBER: .on() is a listener
socket.on('connect', function() {
  console.log('Connected to server');
});

socket.on('newMessage', function(m) {
  console.log('========================');
  console.log(m);
  console.log('========================');
  const li = $('<li></li>');
  li.text(`${m.sender}: ${m.text}`);
  messages.append(li);
});

socket.on('disconnect', function() {
  console.log('Disconnected from server');
});

// socket.on('clientJoin', m => console.log(m));

// socket.on('newClientJoin', m => console.log(m));

function newMessage(message) {
  socket.emit('createMessage', {sender: 'client', text: message }, function(data) {
    console.log(data);
  });
}


$('#messageForm').on('submit', function(e) {
  e.preventDefault();
  newMessage(message.val());
  message.val('');
});