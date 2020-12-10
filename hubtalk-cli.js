#!/usr/bin/env node
const {sendMessages} = require("./src/messages");
const {encryptForSelf} = require("./src/crypt");
const {downloadPublicKey} = require("./src/crypt");
const {downloadAllMessages} = require("./src/messages");
const {decrypt} = require("./src/crypt");
const {readMessages} = require("./src/messages");
const {encrypt, generateKeys} = require("./src/crypt");
const {createMessage} = require("./src/messages");
const {getFriends} = require("./src/friends");
const {addFriend} = require("./src/friends");
const argv = require('yargs/yargs')(process.argv.slice(2))
  .command({
    command: 'af <name>',
    desc: 'Add a friend. (Github username)',
    handler: (argv) => handleAddFriend(argv.name)
  })
  .command({
    command: 'lf',
    desc: 'List friends.',
    handler: (argv) => handleListFriends()
  })
  .command({
    command: 'msg <name> <message>',
    desc: 'Send message to a friend.',
    handler: (argv) => handleWriteMessage(argv.name, argv.message)
  })
  .command({
    command: 'show <name>',
    desc: 'Show conversation with a friend.',
    handler: (argv) => handleShowConversation(argv.name)
  })
  .command({
    command: 'receive',
    desc: 'Fetch all messages from friends.',
    handler: (argv) => handleReceive()
  })
  .command({
    command: 'send',
    desc: 'Send all messages.',
    handler: (argv) => handleSend()
  })
  .command({
    command: 'setup',
    desc: 'Initial setup',
    handler: (argv) => handleSetup()
  })
  .demandCommand()
  .help()
  .argv;

async function handleAddFriend(name) {
  console.log(`Adding friend: ${name}`);
  const key = await downloadPublicKey(name);
  addFriend(name, key);
}

function handleListFriends() {
  console.log(`Listing friends`);
  const friends = getFriends();

  friends.forEach(friend => console.log(friend.name));
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
    inbox: messages.inbox.map(message => ({time: message.time, message: decrypt(message.message)})),
    outbox: messages.outbox.map(message => ({time: message.time, message: decrypt(message.shadow)})),
  };

  const conversation = decrypted.inbox
    .map(msg => ({...msg, from: name}))
    .concat(decrypted.outbox.map(msg => ({...msg, from: 'You'})));

  conversation.sort((a, b) => a.time - b.time);

  conversation.forEach((message) => {
    console.log(`From ${message.from} at ${new Date(message.time).toISOString()}`)
    console.log(message.message);
    console.log(`---------`);
  });
}

async function handleReceive() {
  console.log('Receiving new messages.');
  await downloadAllMessages(getFriends());
  console.log('Done.');
}

function handleSend() {
  console.log('Sending all messages...');
  sendMessages();
  console.log('Done!');
}

function handleSetup() {
  console.log('Setup')
  console.log('- Generating your RSA key pair...');
  generateKeys();
  console.log('Done. You can start sending messages.');
}