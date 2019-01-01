const generateMessage = (sender, text) => {
  return {
    sender,
    text,
    createdAt: new Date().getTime()
  }
};

module.exports = generateMessage;