const { Router } = require('express');
const { urlEncodedParser } = require('./registration.middleware');
const { registrationForm } = require('./registration.form');
const { RegistrationService } = require('./registration.service');

const RegistrationController = Router();

RegistrationController.get('/', (req, res) => res.render('registration', {
  form: registrationForm,
  values: {},
  errors: {},
}));

RegistrationController.post('/', urlEncodedParser, async (req, res) => {
  const { name, password, email, contactPhone } = req.body;

  try {
    const result = await RegistrationService.register({ name, password, email, contactPhone });

    if ('error' in result) {
      return res.status(422).render('registration', {
        form: registrationForm,
        values: { name, password, email, contactPhone },
        errors: result.error,
      });
    }

    return res.redirect('/auth/login');

  } catch (error) {
    throw new Error(`[RegistrationController][post][/]. Error: ${error.message}.`);
  }
});

exports.RegistrationController = RegistrationController;
