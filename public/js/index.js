const socket = io();
const $ = jQuery;

// DOM SELECTORS
const message = $('#message');
const messages = $('#messages');
const sendLocationButton = $('#sendLocationButton');

// UTILS
const timeFormat = 'h:mm:ss a';

// REMEMBER: .on() is a listener
socket.on('connect', function() {
  console.log('Connected to server');
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

  // console.log(m);
  // const li = $('<li></li>');
  // li.text(`${m.sender} ${formattedTime}: ${m.text}`);
  // messages.append(li);
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
  // console.log(m);
  // const li = $('<li></li>');
  // const a = $('<a target="_blank">My current location</a>');
  // a.attr('href', m.url);
  // li.text(`${m.sender} ${formattedTime}: `);
  // li.append(a);
  // messages.append(li);
});

socket.on('disconnect', function() {
  console.log('Disconnected from server');
});

// socket.on('clientJoin', m => console.log(m));

// socket.on('newClientJoin', m => console.log(m));

function newMessage(message) {
  socket.emit('clientMsg', {sender: 'client', text: message }, function(data) {
    console.log(data);
  });
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