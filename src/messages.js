const axios = require("axios");
const {getUserName} = require("./user");
const {existsSync, readFileSync, writeFileSync} = require("fs");

function getInboxPath(name) {
  return `${process.cwd()}/inbox/${name}.json`;
}

const downloadMessagesForFriend = async (name) => {
  try {
    return await axios.get(getMessagesURLForFriend(name), {responseType: "json"})
      .then(response => {
        writeFileSync(
          getInboxPath(name),
          JSON.stringify(response.data, null, 2)
        );

        return response.data;
      });
  } catch (e) {
    return [];
  }
}

const downloadAllMessages = async (friends) => {
  return Promise.all(friends.map((friend) => downloadMessagesForFriend(friend.name))).then((data) => data);
}

const getMessagesURLForFriend = (name) => {
  return `https://raw.githubusercontent.com/${name}/hubtalk/master/outbox/${getUserName()}.json`;
}

const getOutboxPath = (recipient) => {
  return `${process.cwd()}/outbox/${recipient}.json`;
}

const createMessage = (name, message, shadow) => {
  const messages = readMessages(name).outbox;
  const filename = getOutboxPath(name);

  writeFileSync(filename, JSON.stringify([...messages, {time: Date.now(), message, shadow}]));
}

const readMessages = (name) => {
  const messages = {
    inbox: [],
    outbox: []
  }

  if (existsSync(getOutboxPath(name))) {
    const outboxMessages = readFileSync(getOutboxPath(name)).toString();
    messages.outbox = JSON.parse(outboxMessages);
  }

  if (existsSync(getInboxPath(name))) {
    const inboxMessages = readFileSync(getInboxPath(name)).toString();
    messages.inbox = JSON.parse(inboxMessages);
  }

  return messages;
}

module.exports = {
  getMessagesURLForFriend,
  downloadMessagesForFriend,
  downloadAllMessages,
  readMessages,
  createMessage
}