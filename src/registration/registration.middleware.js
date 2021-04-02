const bodyParser = require('body-parser');

const urlEncodedParser = bodyParser.urlencoded({ extended: true });
exports.urlEncodedParser = urlEncodedParser;
