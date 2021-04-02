const bcrypt = require('bcrypt');

class Security {
  static SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10;

  static checkPasswordIsValid(password) {
    return password !== '';
  }

  static async hash(password) {
    if (!Security.checkPasswordIsValid(password)) {
      return '';
    }

    try {
      const salt = await bcrypt.genSalt(Security.SALT_ROUNDS);
      const hash = await bcrypt.hash(password, salt);

      return hash;
    } catch (error) {
      throw new Error('[Security]. The error occured while hashing the password.');
    }
  }

  static async compare(password, hash) {
    try {
      const match = await bcrypt.compare(password, hash);

      return match;
    } catch (error) {
      throw new Error('[Security]. The error occured while matching user password.');
    }
  }
}

exports.Security = Security;
