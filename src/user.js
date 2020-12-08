const {execSync} = require("child_process");

const getUserName = () => {
  const cmd = `git remote -v`;

  const cmdOut = execSync(cmd).toString();

  try {
    return cmdOut.match(/:(.*)\//)[1];
  } catch (e) {
    throw new Error('Could not get username :(');
  }
}

module.exports = {
  getUserName
}