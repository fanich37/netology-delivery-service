const mongoose = require('mongoose');
const {
  MONGO_DB_CONNECTION,
  MONGO_DB_USER,
  MONGO_DB_PASSWORD,
  MONGO_DB_NAME,
} = process.env;

async function initDb() {
  try {
    await mongoose.connect(MONGO_DB_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      user: MONGO_DB_USER,
      pass: MONGO_DB_PASSWORD,
      dbName: MONGO_DB_NAME,
    });
  } catch (error) {
    throw new Error(`[initDb]. Error: ${error.message}.`);
  }
}
exports.initDb = initDb;
