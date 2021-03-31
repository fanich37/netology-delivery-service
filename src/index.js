try {
  require('dotenv').config({ path: './.env.dev' });
  // eslint-disable-next-line no-empty
} catch (error) { }

const { app } = require('./app');

const { PORT } = process.env;

app.listen(PORT, () => {
  console.log(`The app is running on port ${PORT}`);
});
