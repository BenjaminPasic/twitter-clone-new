const bcrypt = require("bcrypt");

const saltRounds = 10;

const hashPassword = async (plainTextPassword) => {
  try {
    return await bcrypt.hash(plainTextPassword, saltRounds);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  hashPassword,
};
