const { Router } = require('express');
const { UserService } = require('../core/user');
const { transformErrors } = require('../utils/transformers');
const { urlEncodedParser, emptyValueValidator } = require('./registration.middleware');

const RegistrationController = Router();

RegistrationController.get('/', (req, res) => res.render(''));

RegistrationController.post('/', urlEncodedParser, emptyValueValidator, async (req, res) => {
  const { name, password, email, contactPhone } = req.body;

  try {
    const result = await UserService.create({ name, password, email, contactPhone });

    return 'error' in result
      ? res.status(422).json(transformErrors(result.error))
      : res.json(result);
  } catch (error) {
    throw new Error('[RegistrationController]. The error occured while creating new user.');
  }
});

exports.RegistrationController = RegistrationController;
