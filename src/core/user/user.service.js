const { DB } = require('../../db');
const { User, UserSchema } = require('./user.model');

const userDb = new DB('user', UserSchema);

class UserService {
  constructor(db) {
    this.db = db;
  }

  async create({ email, passwordHash, name, contactPhone }) {
    try {
      const user = new User({ email, passwordHash, name, contactPhone });
      const result = await this.db.create(user);
      // eslint-disable-next-line no-unused-vars
      const { passwordHash: hash, ...rest } = result;

      return rest;
    } catch (error) {
      throw new Error(`[UserService][create]. Error: ${error.message}`);
    }
  }

  async findByEmail(email) {
    try {
      const user = await this.db.findOneByParams({ email });

      return user;
    } catch (error) {
      throw new Error(`[UserService][findByEmail]. Error: ${error.message}`);
    }
  }
}

exports.UserService = new UserService(userDb);
