#!/usr/bin/env node
/* eslint-disable no-use-before-define */
const { execSync } = require("child_process");
const yargs = require("yargs/yargs");
const { PATH_DATA } = require("./src/constants");
const { sendMessages } = require("./src/messages");
const { encryptForSelf } = require("./src/crypt");
const { downloadPublicKey } = require("./src/crypt");
const { downloadAllMessages } = require("./src/messages");
const { decrypt } = require("./src/crypt");
const { readMessages } = require("./src/messages");
const { encrypt, generateKeys } = require("./src/crypt");
const { createMessage } = require("./src/messages");
const { getFriends } = require("./src/friends");
const { addFriend } = require("./src/friends");

// eslint-disable-next-line no-unused-expressions
yargs(process.argv.slice(2))
  .command({
    command: "add <name>",
    desc: "Add a friend. (Github username)",
    handler: (argv) => handleAddFriend(argv.name),
  })
  .command({
    command: "friends",
    desc: "List friends.",
    handler: () => handleListFriends(),
  })
  .command({
    command: "msg <name> <message>",
    desc: "Send message to a friend.",
    handler: (argv) => handleWriteMessage(argv.name, argv.message),
  })
  .command({
    command: "show <name>",
    desc: "Show conversation with a friend.",
    handler: (argv) => handleShowConversation(argv.name),
  })
  .command({
    command: "receive",
    desc: "Fetch all messages from friends.",
    handler: () => handleReceive(),
  })
  .command({
    command: "send",
    desc: "Send all messages.",
    handler: () => handleSend(),
  })
  .command({
    command: "setup <github-username>",
    desc: "Initial setup",
    handler: (argv) => handleSetup(argv.name),
  })
  .demandCommand()
  .help().argv;

async function handleAddFriend(name) {
  console.log(`Adding friend: ${name}`);
  const key = await downloadPublicKey(name);
  addFriend(name, key);
}

function handleListFriends() {
  console.log(`Listing friends`);
  const friends = getFriends();

  friends.forEach((friend) => console.log(friend.name));
}

function handleWriteMessage(name, message) {
  console.log(`Wrote message to ${name}, ${message}`);
  const encryptedMessage = encrypt(message, name);
  const encryptedMessageForSelf = encryptForSelf(message);
  createMessage(name, encryptedMessage, encryptedMessageForSelf);
}

function handleShowConversation(name) {
  console.log(`Showing Conversation with ${name}.`);
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

  conversation.forEach((message) => {
    console.log(
      `From ${message.from} at ${new Date(message.time).toISOString()}`
    );
    console.log(message.message);
    console.log(`---------`);
  });
}

async function handleReceive() {
  console.log("Receiving new messages.");
  await downloadAllMessages(getFriends());
  console.log("Done.");
}

function handleSend() {
  console.log("Sending all messages...");
  sendMessages();
  console.log("Done!");
}

function getBoxGitCommand() {
  return `git -C ./${PATH_DATA}`;
}

function handleSetup(name) {
  console.log("Setup");
  console.log("- Cloning data repository...");
  const cloneCmd = `git clone git@github.com:${name}/hubtalk-box.git ./${PATH_DATA}`;
  execSync(cloneCmd);
  console.log("- Generating your RSA key pair...");
  generateKeys();
  const gitAddCmd = `${getBoxGitCommand()} add --all`;
  execSync(gitAddCmd);
  const gitCommitCmd = `${getBoxGitCommand()} commit -a -m "Publishing key"`;
  execSync(gitCommitCmd);
  const gitPushCmd = `${getBoxGitCommand()} push origin master`;
  execSync(gitPushCmd);
  console.log("Done. You can start sending messages.");
}
