const { AuthController } = require('./auth.controller');
const { AuthService } = require('./auth.service');
const { restrictedRouteMiddleware } = require('./auth.middleware');

exports.AuthController = AuthController;
exports.AuthService = AuthService;
exports.restrictedRouteMiddleware = restrictedRouteMiddleware;
