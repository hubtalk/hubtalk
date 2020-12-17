const axios = require("axios");
const { execSync } = require("child_process");
const { existsSync, readFileSync, writeFileSync } = require("fs");
const { PATH_DATA } = require("./constants");
const { getUserName } = require("./user");

const getInboxPath = (name) =>
  `${process.cwd()}/${PATH_DATA}/inbox/${name}.json`;

const getOutboxPath = (recipient) =>
  `${process.cwd()}/${PATH_DATA}/messages/outbox/${recipient}.json`;

const getMessagesURLForFriend = (name) =>
  `https://raw.githubusercontent.com/${name}/hubtalk-box/master/messages/outbox/${getUserName()}.json`;

const downloadMessagesForFriend = async (name) => {
  try {
    return await axios
      .get(getMessagesURLForFriend(name), { responseType: "json" })
      .then((response) => {
        writeFileSync(
          getInboxPath(name),
          JSON.stringify(response.data, null, 2)
        );

        return response.data;
      });
  } catch (e) {
    return [];
  }
};

const downloadAllMessages = async (friends) =>
  Promise.all(
    friends.map((friend) => downloadMessagesForFriend(friend.name))
  ).then((data) => data);

const readMessages = (name) => {
  const messages = {
    inbox: [],
    outbox: [],
  };

  if (existsSync(getOutboxPath(name))) {
    const outboxMessages = readFileSync(getOutboxPath(name)).toString();
    messages.outbox = JSON.parse(outboxMessages);
  }

  if (existsSync(getInboxPath(name))) {
    const inboxMessages = readFileSync(getInboxPath(name)).toString();
    messages.inbox = JSON.parse(inboxMessages);
  }

  return messages;
};

const createMessage = (name, message, shadow) => {
  const messages = readMessages(name).outbox;
  const filename = getOutboxPath(name);

  writeFileSync(
    filename,
    JSON.stringify([...messages, { time: Date.now(), message, shadow }])
  );
};

const sendMessages = () => {
  const cmd = `git -C ./${PATH_DATA} add outbox/\\* && git -C ./${PATH_DATA} commit -m "Sending ${Date.now()}" && git -C ./${PATH_DATA} push origin master`;
  execSync(cmd);
};

module.exports = {
  getMessagesURLForFriend,
  downloadMessagesForFriend,
  downloadAllMessages,
  readMessages,
  createMessage,
  sendMessages,
};
