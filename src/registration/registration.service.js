const { generateErrors } = require('../utils/generate-errors');
const { transformErrors } = require('../utils/transformers');
const { Security } = require('../utils/security');
const { UserService } = require('../core/user');
const { validateUserData } = require('./registration.validators');

class RegistrationService {
  static generateUserExistsError(email) {
    return generateErrors([{
      message: `user with email ${email} already exists`,
      key: 'email',
    }]);
  }

  constructor(userService, security) {
    this.userService = userService;
    this.security = security;
  }

  async register({ name, password, email, contactPhone }) {
    const { error } = validateUserData({ name, password, email, contactPhone });

    if (error) {
      return { error: transformErrors(error) };
    }

    try {
      const isUserAlreadyExist = await this.userService.findByEmail(email);

      if (isUserAlreadyExist) {
        const generatedError = RegistrationService.generateUserExistsError(email);

        return { error: transformErrors(generatedError.error) };
      }

      const passwordHash = await this.security.hash(password);
      const result = await this.userService.create({ name, passwordHash, email, contactPhone });

      return result;
    } catch (error) {
      throw new Error(`[RegistrationService][register]. Error: ${error.message}.`);
    }
  }
}

exports.RegistrationService = new RegistrationService(UserService, Security);
