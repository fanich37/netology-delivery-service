const uuid = require('uuid').v4;

class Chat {
  constructor(users) {
    this._id = uuid();
    this.users = users;
    this.createdAt = new Date().toISOString();
    this.messages = [];
  }
}

class Message {
  constructor(author, sentAt, text, readAt = null) {
    this._id = uuid();
    this.author = author;
    this.sentAt = sentAt;
    this.text = text;
    this.readAt = readAt;
  }
}

const ChatSchema = {
  _id: String,
  users: {
    type: [String],
    ref: 'user',
  },
  createdAt: Date,
  messages: [{
    _id: String,
    author: String,
    sentAt: String,
    text: String,
    readAt: String,
  }],
};

exports.Chat = Chat;
exports.Message = Message;
exports.ChatSchema = ChatSchema;
