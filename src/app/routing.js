const { app } = require('./app');
const { RegistrationController } = require('../registration');

app.use('/signup', RegistrationController);
app.use('*', (_, res) => res.sendStatus(404));

exports.app = app;
