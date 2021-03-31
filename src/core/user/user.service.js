const { Security } = require('../../security');
const { generateErrors } = require('../../utils/generate-errors');
const { DB } = require('../../db');
const { validateUserData } = require('./user.validators');
const { User, UserSchema } = require('./user.model');

const userDb = new DB('user', UserSchema);

class UserService {
  constructor(db, security) {
    this.db = db;
    this.security = security;
  }

  static generateUserExistsError(email) {
    return generateErrors([{
      message: `User with email ${email} already exists`,
      key: 'email',
    }]);
  }

  async create({ email, password, name, contactPhone }) {
    const { error } = validateUserData({
      email,
      password,
      name,
      contactPhone,
    });

    if (error !== undefined) {
      return { error };
    }

    try {
      const user = await this.findByEmail(email);

      if (user) {
        return UserService.generateUserExistsError(email);
      }

      const passwordHash = await this.security.hash(password);
      const newUser = new User({ email, passwordHash, name, contactPhone });
      const result = await this.db.create(newUser);
      // eslint-disable-next-line no-unused-vars
      const { passwordHash: hash, ...rest } = result;

      return rest;
    } catch (error) {
      throw new Error('[UserService]. The error occured while creating new user.');
    }
  }

  async findByEmail(email) {
    try {
      const user = await this.db.findOneByParams({ email });

      return user;
    } catch (error) {
      throw new Error(`[UserService]. The error occured while searching for user with email: ${email}.`);
    }
  }
}

exports.UserService = new UserService(userDb, Security);
