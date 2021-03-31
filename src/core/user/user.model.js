const uuid = require('uuid').v4;

class User {
  constructor({ email, passwordHash, name, contactPhone = '' }) {
    this._id = uuid();
    this.email = email;
    this.passwordHash = passwordHash;
    this.name = name;
    this.contactPhone = contactPhone;
  }
}

const UserSchema = {
  _id: String,
  email: String,
  passwordHash: String,
  name: String,
  contactPhone: String,
};

exports.User = User;
exports.UserSchema = UserSchema;
