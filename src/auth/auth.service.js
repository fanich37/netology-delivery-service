const passport = require('passport');
const { Strategy } = require('passport-local');
const expressSession = require('express-session');
const { UserService } = require('../core/user');
const { Security } = require('../utils/security');
const { generateErrors } = require('../utils/generate-errors');
const { transformErrors } = require('../utils/transformers');

class AuthService {
  static COOKIE_NAME = 'advertisement_service';
  static COOKIE_SECRET = process.env.COOKIE_SECRET || 'some_secret';

  constructor(userService, security) {
    this.userService = userService;
    this.security = security;
    this.verify = this.verify.bind(this);
    this.deserializeUser = this.deserializeUser.bind(this);
  }

  serializeUser(user, done) {
    const { _id, email } = user;

    return done(null, `${_id}_${email}`);
  }

  async deserializeUser(data, done) {
    const [_id] = data.split('_');

    try {
      const user = await this.userService.findUserById(_id);

      return done(null, user);
    } catch (error) {
      throw new Error(`[AuthService][deserializeUser]. Error: ${error.message}.`);
    }
  }

  init(app) {
    app.use(expressSession({
      secret: AuthService.COOKIE_SECRET,
      name: AuthService.COOKIE_NAME,
      resave: false,
      saveUninitialized: false,
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    const strategy = new Strategy({
      usernameField: 'email',
      passwordField: 'password',
    }, this.verify);
    passport.use('local', strategy);
    passport.serializeUser(this.serializeUser);
    passport.deserializeUser(this.deserializeUser);
  }

  async verify(email, password, done) {
    try {
      const user = await this.userService.findByEmail(email);

      if (!user) {
        const generatedError = generateErrors([
          { key: 'email', message: `there is no user with email ${email}` },
        ]);

        return done(null, false, { error: transformErrors(generatedError.error) });
      }

      const { passwordHash = '' } = user;
      const isPassportValid = await this.security.compare(password, passwordHash);

      if (!isPassportValid) {
        const generatedError = generateErrors([{ key: 'password', message: 'the password is not valid' }]);

        return done(null, false, { error: transformErrors(generatedError.error) });
      }
      return done(null, user);
    } catch (error) {
      throw new Error(`[AuthService][verify]. Error: ${error.message}`);
    }
  }

  login(req, res, next) {
    return new Promise((resolve, reject) => {
      passport.authenticate('local', (error, user, errors) => {
        if (error) {
          return reject(error);
        }

        if (!user) {
          return resolve(errors);
        }

        req.login(user, (error) => error ? next(error) : resolve(user));
      })(req, res, next);
    });
  }
}

exports.AuthService = new AuthService(UserService, Security);
