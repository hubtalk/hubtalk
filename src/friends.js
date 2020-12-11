const fs = require("fs");

const getFriendsFilePath = () => `${process.cwd()}/friends.json`;

const getFriends = () => {
  if (fs.existsSync(getFriendsFilePath())) {
    const friendsFileContent = fs.readFileSync(getFriendsFilePath()).toString();
    return JSON.parse(friendsFileContent);
  }
  return [];
};

const addFriend = (name, key) => {
  const friends = getFriends();

  if (friends.find((friend) => friend.name === name)) {
    return;
  }

  fs.writeFileSync(
    getFriendsFilePath(),
    JSON.stringify([...friends, { name, key }])
  );
};

module.exports = {
  addFriend,
  getFriends,
  getFriendsFilePath,
};
