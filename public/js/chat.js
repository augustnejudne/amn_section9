const socket = io();
const $ = jQuery;

// DOM SELECTORS
const message = $('#message');
const messages = $('#messages');
const sendLocationButton = $('#sendLocationButton');

// UTILS
const timeFormat = 'h:mm:ss a';

const scrollToBottom = () => {
  // // Selectors
  const newMessage = messages.children('li:last-child');

  // // Heights
  const clientHeight = messages.prop('clientHeight');
  const scrollTop = messages.prop('scrollTop');
  const scrollHeight = messages.prop('scrollHeight');
  const newMessageHeight = newMessage.innerHeight();
  const lastMessageHeight = newMessage.prev().innerHeight();

  if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
};

// REMEMBER: .on() is a listener
socket.on('connect', function() {
  const params = $.deparam(window.location.search);

  socket.emit('join', params, function(err) {
    if (err) {
      alert(err);
      window.location.href = '/';
    } else {
      console.log('No error');
    }
  });
});

socket.on('serverMsg', function(m) {
  const messageTemplate = $('#messageTemplate').html();
  const formattedTime = moment(m.createdAt).format(timeFormat);
  const html = Mustache.render(messageTemplate, {
    text: m.text,
    sender: m.sender,
    createdAt: formattedTime
  });

  messages.append(html);
  scrollToBottom();
});

socket.on('clientLocation', function(m) {
  const locationTemplate = $('#locationTemplate').html();
  const formattedTime = moment(m.createdAt).format(timeFormat);
  const html = Mustache.render(locationTemplate, {
    url: m.url,
    sender: m.sender,
    createdAt: formattedTime
  });

  messages.append(html);
  scrollToBottom();
});

socket.on('disconnect', function() {
  console.log('Disconnected from server');
});

socket.on('updateUserList', function(users) {
  // console.log('Users list', users);
  const ol = $('<ol></ol>');
  users.forEach((user) => {
    ol.append($('<li></li>').text(user));
  });

  $('#users').html(ol);
});


function newMessage(message) {
  socket.emit('clientMsg', {sender: 'client', text: message });
}


$('#messageForm').on('submit', function(e) {
  e.preventDefault();
  newMessage(message.val());
  message.val('');
});

sendLocationButton.on('click', function() {
  if (!navigator.geolocation) {
    return alert('Geolocation is not supported.');
  }

  sendLocationButton.attr('disabled', 'disabled').text('Sending Location...');

  navigator.geolocation.getCurrentPosition( function (position) {
    sendLocationButton.removeAttr('disabled').text('Send Location');
    const userPosition = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    };
    socket.emit('clientLocation', userPosition);
  }, function () {
    sendLocationButton.removeAttr('disabled').text('Send Location');
    alert('Unable to fetch location!');
  });
});