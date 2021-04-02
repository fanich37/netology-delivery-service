const express = require('express');
const expressHandlebars = require('express-handlebars');
const path = require('path');

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
]);

exports.app = app;
