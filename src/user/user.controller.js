const { Router } = require('express');
const { UserService } = require('../core/user');
const { ChatService } = require('../core/chat');
const { restrictedRouteMiddleware } = require('../auth/');

const UserController = Router();

UserController.get('/:id', restrictedRouteMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const user = await UserService.findUserById(id);
    const chats = await ChatService.findAllChats(id, { path: 'users', select: ['email', 'name'] });

    const filteredChats = chats.map((chat) => ({
      ...chat,
      user: chat.users.filter(({ _id }) => _id !== id)[0],
    }));

    return user
      ? res.render('user', { user, chats: filteredChats, userId: user._id })
      : res.status(404).render('not-found');
  } catch (error) {
    throw new Error(`[UserController][get][:/id]. Error: ${error.message}.`);
  }
});

exports.UserController = UserController;
