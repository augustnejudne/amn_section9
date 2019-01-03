/* eslint no-undef: 0 */
///////////////
// LIBRARIES //
///////////////
const socket = io();
const $ = jQuery;

///////////////////
// DOM SELECTORS //
///////////////////
const message = $('#message');
const messages = $('#messages');
const sendLocationButton = $('#sendLocationButton');

///////////
// UTILS //
///////////
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

  if (
    clientHeight + scrollTop + newMessageHeight + lastMessageHeight >=
    scrollHeight
  ) {
    messages.scrollTop(scrollHeight);
  }
};

///////////////////////
// CLIENT ON CONNECT //
///////////////////////
// REMEMBER: .on() is an eventListener
// is called upon upon connecting to server
socket.on('connect', function() {
  const params = $.deparam(window.location.search);
  params.room = params.room.toLowerCase();

  // emit this upon joining a room
  // client immediately joins a room upon connect
  socket.emit('join', params, function(err) {
    console.log(params);
    if (err) {
      alert(err);
      window.location.href = '/';
    }
  });
});

//////////////////////////
// ON CLIENT DISCONNECT //
//////////////////////////
/**
 * 'disconnect' is a built-in event
 */
socket.on('disconnect', function() {
  console.log('Disconnected from server');
});

//////////////////////////////
// CLIENT ON SERVER MESSAGE //
//////////////////////////////
/**
 * Listens for an event from server called 'serverMsg'
 */
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

///////////////////////////////
// CLIENT ON CLIENT LOCATION //
///////////////////////////////
/**
 * listens for an event from server called 'clientLocation'
 */
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

//////////////////////
// UPDATE USER LIST //
//////////////////////
/**
 * listens for updateUserList event
 */
socket.on('updateUserList', function(users) {
  const ol = $('<ol></ol>');
  users.forEach(user => {
    ol.append($('<li></li>').text(user));
  });

  $('#users').html(ol);
});


/////////////////////////
// DOM BUTTON HANDLERS //
/////////////////////////
$('#messageForm').on('submit', function(e) {
  e.preventDefault();
  socket.emit('clientMsg', { text: message.val() });
  message.val('');
});

sendLocationButton.on('click', function() {
  if (!navigator.geolocation) {
    return alert('Geolocation is not supported.');
  }

  sendLocationButton.attr('disabled', 'disabled').text('Sending Location...');

  navigator.geolocation.getCurrentPosition(
    function(position) {
      const userPosition = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
      socket.emit('clientLocation', userPosition);
      // fs.writeFileSync('socket.txt', inspect(socket));
      sendLocationButton.removeAttr('disabled').text('Send Location');
    },
    function() {
      sendLocationButton.removeAttr('disabled').text('Send Location');
      alert('Unable to fetch location!');
    }
  );
});
