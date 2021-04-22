const { Router } = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const { ChatService } = require('./chat.service');

const ChatController = Router();

ChatController.post('/', jsonParser, async (req, res) => {
  const { author, receiver, socketId } = req.body;

  try {
    const { _id, messages } = await ChatService.findChat([receiver, author]);
    ChatService.startChat(socketId, _id);

    return res.json({ messages, chatId: _id });
  } catch (error) {
    throw new Error(`[ChatController][post][/]. Error: ${error.message}.`);
  }
});

ChatController.post('/close', jsonParser, async (req, res) => {
  const { chatId, socketId } = req.body;

  try {
    ChatService.closeChat(socketId, chatId);

    return res.json({ closed: true });
  } catch (error) {
    throw new Error(`[ChatController][post][/]. Error: ${error.message}.`);
  }
});

exports.ChatController = ChatController;
