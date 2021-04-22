const { createServer } = require('http');
const { app } = require('./routing');
const { ChatService } = require('../core/chat');

const server = createServer(app);
ChatService.init(server);

exports.server = server;
