const axios = require("axios");
const {getUserName} = require("./user");
const {existsSync, readFileSync, writeFileSync} = require("fs");

const downloadMessagesFromFriend = async (name) => {
  console.log(getMessagesURLForFriend(name));
  try {
    const response = await axios.get(getMessagesURLForFriend(name))
    return JSON.parse(response.toString());
  } catch (e) {
    throw new Error('Could not download file!');
  }
}

const getMessagesURLForFriend = (name) => {
  return `https://raw.githubusercontent.com/${name}/hubtalk/master/outbox/${getUserName()}.json`;
}

const getMessageFileName = (recipient) => {
  return `${process.cwd()}/outbox/${recipient}.json`;
}

const writeMessage = (name,message) => {
  const messages = getMessages(name);
  const filename = getMessageFileName(name);

  writeFileSync(filename, JSON.stringify([...messages, {time: Date.now(), message}]));
}

const getMessages = (name) => {
  if (existsSync(getMessageFileName(name))) {
    const friendsFileContent = readFileSync(getMessageFileName(name)).toString();
    return JSON.parse(friendsFileContent);
  } else {
    return [];
  }
}

module.exports = {
  getMessagesURLForFriend,
  downloadMessagesFromFriend,
  getMessages,
  writeMessage
}