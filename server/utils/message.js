const moment = require('moment');

const generateMessage = (sender, text) => {
  return {
    sender,
    text,
    createdAt: moment().valueOf()
  };
};

const generateLocationMessage = (sender, latitude, longitude) => {
  return {
    sender,
    url: `https://www.google.com/maps/search/?q=${latitude},${longitude}`,
    createdAt: moment().valueOf()
  };
};

module.exports = {
  generateMessage,
  generateLocationMessage
};