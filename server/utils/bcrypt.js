const bcrypt = require("bcrypt");

const saltRounds = 10;

const encryptPassword = async (plainTextPassword) => {
  try {
    return await bcrypt.hash(plainTextPassword, saltRounds);
  } catch (error) {
    console.log("Encryption: ", error);
  }
};

const decryptPassword = async (plainTextPassword, hashedPassword) => {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

module.exports = {
  encryptPassword,
  decryptPassword,
};
