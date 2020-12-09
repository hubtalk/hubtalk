const fs = require("fs");

const addFriend = (name, key) => {
  const friends = getFriends();

  if (friends.find(friend => friend.name === name)) {
    return;
  }

  fs.writeFileSync(getFriendsFilePath(), JSON.stringify([...friends, {name, key}]));
}

const getFriends = () => {
  if (fs.existsSync(getFriendsFilePath())) {
    const friendsFileContent = fs.readFileSync(getFriendsFilePath()).toString();
    return JSON.parse(friendsFileContent);
  } else {
    return [];
  }
}

const getFriendsFilePath = () => {
  return `${process.cwd()}/friends.json`;
}

module.exports = {
  addFriend,
  getFriends,
  getFriendsFilePath
};