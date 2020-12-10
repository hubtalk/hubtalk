const axios = require("axios");
const {publicEncrypt, privateDecrypt} = require("crypto");
const {readFileSync, existsSync} = require("fs");
const {execSync} = require("child_process");

const {getFriends} = require("./friends");
const {RSA_KEY_NAME, RSA_PUBLIC_KEY_PATH, RSA_PRIVATE_KEY_PATH} = require('./config')

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

const generateKeys = () => {
  if (existsSync(RSA_PUBLIC_KEY_PATH) || existsSync(RSA_PRIVATE_KEY_PATH)) {
    console.error('ERROR: The key pair already exists.')
    return
  }

  const privateCmd = `ssh-keygen -t rsa -b 4096 -P "" -m pem -f ${RSA_PRIVATE_KEY_PATH}`;
  execSync(privateCmd);

  const pubCmd = `ssh-keygen -f ${RSA_PRIVATE_KEY_PATH} -e -m pem > ${RSA_PUBLIC_KEY_PATH}`
  execSync(pubCmd);

  const publishCmd = `git add ${RSA_KEY_NAME}.pub && git commit -m "Publishing public key" && git push origin master`;
  execSync(publishCmd);
}

const getKeyUrl = (name) => {
  return `https://raw.githubusercontent.com/${name}/hubtalk/master/hubtalk_rsa.pub`;
}

module.exports = {
  encrypt,
  encryptForSelf,
  decrypt,
  downloadPublicKey,
  generateKeys
}