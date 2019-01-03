/* eslint no-undef: 0 */
const socket = io();
const $ = jQuery;

const roomList = $('#roomList');
const room = $('#room');

//////////////////////
// UDPATE ROOM LIST //
//////////////////////
socket.on('connect', function() {
  console.log('connected to server');
});

socket.on('updateRoomList', function(rooms) {
  console.log('UPDATEROOMLIST');
  const defaultOptionText = rooms.length > 0 ? 'Select a room' : 'No open rooms';
  const defaultOption = $(`<option value="" selected disabled>${defaultOptionText}</option>`);
  roomList.html(defaultOption);
  rooms.forEach(r => {
    const option = $('<option></option>');
    option.attr('value', r);
    option.text(r);
    roomList.append(option);
  });
});

roomList.on('change', function() {
  room.val(roomList.val());
});
