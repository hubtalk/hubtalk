const axios = require("axios");
const {getFriends} = require("./friends");
const {readFileSync} = require("fs");
const {publicEncrypt, privateDecrypt} = require("crypto");

const encrypt = (message, name) => {
  const buffer = Buffer.from(message, 'utf8');
  return publicEncrypt(getPublicKey(name), buffer)
    .toString('base64');
}

const encryptForSelf = (message) => {
  const buffer = Buffer.from(message, 'utf8');
  return publicEncrypt(getOwnPublicKey(), buffer)
    .toString('base64');
}

const decrypt = (encrypted) => {
  const privateKey = {key: getPrivateKey()};
  const buffer = Buffer.from(encrypted, 'base64');
  return privateDecrypt(privateKey, buffer).toString('utf8');
}

const getPublicKey = (name) => {
  const friends = getFriends()
  return friends.find(friend => friend.name === name).key;
}

const getOwnPublicKey = () => {
  return readFileSync(getOwnPublicKeyPath(), "utf8").toString();

}

const getPrivateKey = () => {
  return readFileSync(getPrivateKeyPath(), "utf8").toString();
}

const getOwnPublicKeyPath = () => {
  return `${process.cwd()}/hubtalk_rsa.pub`;
}

const getPrivateKeyPath = () => {
  return `${process.cwd()}/secret/hubtalk_rsa`;
}

const downloadPublicKey = async (name) => {
  return await axios.get(getKeyUrl(name))
    .then(response => {
      return response.data;
    });
}

const getKeyUrl = (name) => {
  return `https://raw.githubusercontent.com/${name}/hubtalk/master/hubtalk_rsa.pub`;
}

module.exports = {
  encrypt,
  encryptForSelf,
  decrypt,
  downloadPublicKey
}