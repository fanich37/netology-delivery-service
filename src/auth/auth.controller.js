const { Router } = require('express');
const { EmptyValueErrorSymbol } = require('../utils/constants');
const { authForm } = require('./auth.form');
const { urlEncodedParser, emptyValueValidator } = require('./auth.middleware');
const { AuthService } = require('./auth.service');

const AuthController = Router();

AuthController.get('/login', (req, res) => res.render('auth', {
  form: authForm,
  values: {},
  errors: {},
}));

AuthController.post(
  '/login',
  urlEncodedParser,
  emptyValueValidator,
  async (req, res, next) => {
    const { [EmptyValueErrorSymbol]: emptyValueError } = req;
    const { email } = req.body;

    if (emptyValueError) {
      return res.status(400).render('auth', {
        form: authForm,
        values: { email },
        errors: emptyValueError,
      });
    }

    try {
      const result = await AuthService.login(req, res, next);

      if ('error' in result) {
        return res.status(400).render('auth', {
          form: authForm,
          values: { email },
          errors: result.error,
        });
      }

      res.redirect('/');
    } catch (error) {
      throw new Error(`[AuthController][post][/]. Error: ${error.message}`);
    }

  });

AuthController.post('/logout', (req, res) => {
  req.logout();
  res.clearCookie(AuthService.COOKIE_NAME).redirect('/');
});

exports.AuthController = AuthController;
