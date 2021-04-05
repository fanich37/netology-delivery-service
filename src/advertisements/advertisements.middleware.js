const multer = require('multer');
const { FileStorage } = require('../utils/file-storage');
const { fileFilter, ADVERTISEMENT_MAX_IMAGES_COUNT } = require('./advertisements.validators');

const fileStorage = new FileStorage('advertisements');
const multiPartFormDataParser = multer({
  storage: fileStorage.storage,
  fileFilter,
}).fields([
  { name: 'images', maxCount: ADVERTISEMENT_MAX_IMAGES_COUNT },
]);

exports.multiPartFormDataParser = multiPartFormDataParser;
exports.fileStorage = fileStorage;
