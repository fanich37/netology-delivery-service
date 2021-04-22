try {
  require('dotenv').config({ path: './.env.dev' });
  // eslint-disable-next-line no-empty
} catch (error) { }

const { initDb } = require('./db');
const { server } = require('./app');

const { PORT } = process.env;

initDb()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`The app is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    throw new Error(`[index.js]. Error: ${error.message}.`);
  });
