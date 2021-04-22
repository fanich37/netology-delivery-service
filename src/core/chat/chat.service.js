const socketIO = require('socket.io');
const { DB } = require('../../db');
const { UserService } = require('../user/');
const { Chat, Message, ChatSchema } = require('./chat.model');

const chatDb = new DB('chat', ChatSchema);

class ChatService {
  static sortUsers(users) {
    return users.sort((a, b) => a.localeCompare(b));
  }

  constructor(db, userService) {
    this.db = db;
    this.userService = userService;
    this.sendMessage = this.sendMessage.bind(this);
    this.pool = new Map();
  }

  init(server) {
    const io = socketIO(server);

    io.on('connection', (socket) => {
      console.log('socket connected');

      const { id } = socket;
      this.pool.set(id, socket);

      socket.on('disconnect', () => {
        const { id } = socket;
        this.pool.delete(id);

        console.log('socket is closed');
      });
    });
  }

  startChat(socketId, chatId) {
    const socket = this.pool.get(socketId);

    socket.on(chatId, this.sendMessage);
  }

  closeChat(socketId, chatId) {
    const socket = this.pool.get(socketId);

    socket.removeListener(chatId, this.sendMessage);
  }

  async createChat(users) {
    const sortedUsers = ChatService.sortUsers(users);
    const chat = new Chat(sortedUsers);

    try {
      const newChat = await this.db.create(chat);

      return newChat;
    } catch (error) {
      throw new Error(`[ChatService][createChat]. Error: ${error.message}.`);
    }
  }

  async findChat(users) {
    const sortedUsers = ChatService.sortUsers(users);

    try {
      const result = await this.db.findOneByParams({ users: sortedUsers });

      return result || await this.createChat(users);
    } catch (error) {
      throw new Error(`[ChatService][findChat]. Error: ${error.message}.`);
    }
  }

  async findAllChats(userId, populateWith) {
    try {
      const allChats = await this.db.findAllByParams(
        { users: { $in: userId } },
        populateWith,
      );

      return allChats;
    } catch (error) {
      throw new Error(`[ChatService][findAllChats]. Error: ${error.message}.`);
    }
  }

  async getHistory(id) {
    try {
      const chat = await this.db.findOneByParams({ _id: id });

      return chat ? chat.messages : [];
    } catch (error) {
      throw new Error(`[ChatService][getHistory]. Error: ${error.message}.`);
    }
  }

  async sendMessage({ author, receiver, text, socketId }) {
    const socket = this.pool.get(socketId);
    const sortedUsers = ChatService.sortUsers([author, receiver]);

    try {
      const { _id: chatId } = await this.findChat(sortedUsers);
      const message = new Message(
        author,
        new Date().toISOString(),
        text,
      );

      await this.db.update(chatId, { $push: { messages: message } });

      socket.broadcast.emit(chatId, message);
      socket.emit(chatId, message);
    } catch (error) {
      throw new Error(`[ChatService][sendMessage]. Error: ${error.message}.`);
    }
  }
}

exports.ChatService = new ChatService(chatDb, UserService);
