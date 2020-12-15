const { createMessage } = require("./src/messages");
const { encryptForSelf } = require("./src/crypt");
const { encrypt } = require("./src/crypt");
const { readMessages } = require("./src/messages");
const { decrypt } = require("./src/crypt");
const { getFriends } = require("./src/friends");
const { createLayout, terminalGreen } = require("./src/layout");

const formatDate = (date) => {
  const day = `0${date.getDate()}`.slice(-2);
  const month = `0${date.getMonth()}`.slice(-2);
  const hours = `0${date.getHours()}`.slice(-2);
  const minutes = `0${date.getMinutes()}`.slice(-2);
  return `[${day}/${month} ${hours}:${minutes}]`;
};

function displayMessage(name, element) {
  const messages = readMessages(name);

  const decrypted = {
    inbox: messages.inbox.map((message) => ({
      time: message.time,
      message: decrypt(message.message),
    })),
    outbox: messages.outbox.map((message) => ({
      time: message.time,
      message: decrypt(message.shadow),
    })),
  };

  const conversation = decrypted.inbox
    .map((msg) => ({ ...msg, from: name }))
    .concat(decrypted.outbox.map((msg) => ({ ...msg, from: "You" })));

  conversation.sort((a, b) => a.time - b.time);

  element.setContent(
    conversation.reduce(
      (content, message) =>
        [
          content,
          `${formatDate(new Date(message.time))} {${terminalGreen}-fg}<{/}${
            message.from
          }{${terminalGreen}-fg}>{/} ${message.message}`,
        ].join("\n"),
      ""
    )
  );

  element.setScrollPerc(100);
}

function main() {
  const {
    screen,
    messageForm,
    messageTextarea,
    messageSubmit,
    friendsList,
    chatBox,
  } = createLayout();

  let selectedFriend = null;

  const friends = getFriends().map((friend) => friend.name);

  friends.forEach((friend) => {
    friendsList.add(friend);
  });

  screen.key(["escape", "q", "C-c"], () => process.exit(0));
  screen.key(["tab"], () => {
    messageForm.focusNext();
    return false;
  });

  messageTextarea.key(["tab"], () => {
    messageForm.focusNext();
  });

  messageSubmit.on("press", () => {
    const message = messageTextarea.content;
    const name = selectedFriend;

    const encryptedMessage = encrypt(message, name);
    const encryptedMessageForSelf = encryptForSelf(message);
    createMessage(name, encryptedMessage, encryptedMessageForSelf);

    messageTextarea.clearValue();
    displayMessage(name, chatBox);
    screen.render();
  });

  friendsList.on("select", (friend) => {
    selectedFriend = friend.content;
    displayMessage(selectedFriend, chatBox);
    screen.render();
  });

  [selectedFriend] = friends;

  displayMessage(selectedFriend, chatBox);

  screen.render();
}

main();
