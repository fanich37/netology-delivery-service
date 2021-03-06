const { app } = require('./app');
const { RegistrationController } = require('../registration');
const { AuthController } = require('../auth');
const { AdvertisementsController } = require('../advertisements');
const { ChatController } = require('../core/chat');
const { UserController } = require('../user');

app.use('/signup', RegistrationController);
app.use('/auth', AuthController);
app.use('/', AdvertisementsController);
app.use('/user', UserController);
app.use('/api/chat', ChatController);
app.use('*', (_, res) => res.status(404).render('not-found'));
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  console.error(error.message);
  res.sendStatus(500);
});

exports.app = app;
