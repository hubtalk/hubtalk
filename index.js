const {getMessages, writeMessage} = require("./src/messages");
const {addFriend} = require("./src/friends");
const {getFriends} = require("./src/friends");

console.log(getFriends());

addFriend('keriati');
addFriend('peet86');

console.log(getFriends());

writeMessage('peet86', 'Hello World');

console.log(getMessages('keriati'));
console.log(getMessages('peet86'));
