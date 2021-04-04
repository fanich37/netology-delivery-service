const { DB } = require('../../db');
const { User, UserSchema } = require('./user.model');

const userDb = new DB('user', UserSchema, [{
  _id: 'd5ea3272-989f-4bb4-9cbd-446f1058ee79',
  name: 'Mister Twister',
  email: 'test@mail.ru',
  passwordHash: '123123',
  contactPhone: '+7 495 223 32 23',
}]);

class UserService {
  static prepareUser(user) {
    // eslint-disable-next-line no-unused-vars
    const { passwordHash, ...rest } = user;

    return rest;
  }

  constructor(db) {
    this.db = db;
  }

  async create({ email, passwordHash, name, contactPhone }) {
    try {
      const user = new User({ email, passwordHash, name, contactPhone });
      const result = await this.db.create(user);
      const preparedResult = UserService.prepareUser(result);

      return preparedResult;
    } catch (error) {
      throw new Error(`[UserService][create]. Error: ${error.message}.`);
    }
  }

  async findUser(params) {
    try {
      const user = await this.db.findOneByParams(params);
      const preparedResult = UserService.prepareUser(user);

      return preparedResult;
    } catch (error) {
      throw new Error(`[UserService][findUser]. Error: ${error.message}.`);
    }
  }

  async findByEmail(email) {
    try {
      const user = await this.db.findOneByParams({ email });

      return user;
    } catch (error) {
      throw new Error(`[UserService][findByEmail]. Error: ${error.message}.`);
    }
  }
}

exports.UserService = new UserService(userDb);
