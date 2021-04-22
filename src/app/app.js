const express = require('express');
const expressHandlebars = require('express-handlebars');
const path = require('path');
const { AuthService } = require('../auth');

const app = express();

const hbs = expressHandlebars.create({
  layoutsDir: path.join(__dirname, '..', 'templates'),
  partialsDir: [
    path.join(__dirname, '..', 'templates', 'parts'),
    path.join(__dirname, '..', 'templates', 'form'),
  ],
  defaultLayout: 'main',
  extname: '.hbs',
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', [
  path.join(__dirname, '..', 'templates'),
  path.join(__dirname, '..', 'registration'),
  path.join(__dirname, '..', 'auth'),
  path.join(__dirname, '..', 'advertisements', 'templates'),
  path.join(__dirname, '..', 'user'),
  path.join(__dirname, '..', 'core', 'chat'),
]);
app.use('/public', express.static(path.join(__dirname, '..', 'public')));

AuthService.init(app);

exports.app = app;
