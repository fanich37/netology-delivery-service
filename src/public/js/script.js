function createMessageDiv({ text, date, type }) {
  const messageDiv = document.createElement('div');
  const dateDiv = document.createElement('div');
  const textDiv = document.createElement('div');
  messageDiv.classList.add('message', `message_${type}`);
  dateDiv.classList.add('date');
  dateDiv.innerText = date;
  textDiv.innerText = text;

  messageDiv.appendChild(dateDiv);
  messageDiv.appendChild(textDiv);

  return messageDiv;
}

// eslint-disable-next-line no-unused-vars
function initSocket(userId) {
  window._socket = window.io();
}

// eslint-disable-next-line no-unused-vars
class Chat {
  constructor(userId, receiverId) {
    this.userId = userId;
    this.receiverId = receiverId;
    this.chatId = null;
    this.openChat();
  }

  openChat = () => {
    const modal = document.getElementsByClassName('modal').item(0);
    const modalClose = document.getElementsByClassName('modal-close').item(0);

    modal.classList.add('is-active');
    modalClose.addEventListener('click', this.closeChat, { once: true });
    this.startChat();
  }

  closeChat = () => {
    const socket = window._socket;
    const chatForm = document.getElementsByClassName('chat-form').item(0);
    const modal = document.getElementsByClassName('modal').item(0);
    const chat = document.getElementsByClassName('chat').item(0);

    modal.classList.remove('is-active');
    chat.innerHTML = '';
    chatForm.removeEventListener('submit', this.sendMessage);
    socket.removeListener(this.chatId, this.receiveMessage);

    return fetch('/api/chat/close', {
      method: 'POST',
      cache: 'no-cache',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
      body: JSON.stringify({
        chatId: this.chatId,
        socketId: socket.id,
      }),
    })
      .catch((error) => {
        throw new Error(`[Browser]. Error: ${error.message}.`);
      });
  }

  receiveMessage = ({ author, sentAt, text }) => {
    const chat = document.getElementsByClassName('chat').item(0);
    const messageDiv = createMessageDiv({
      text,
      date: sentAt,
      type: author === this.userId ? 'sent' : 'received',
    });

    chat.appendChild(messageDiv);
  }

  sendMessage = (event) => {
    event.preventDefault();

    const socket = window._socket;
    const chatMessage = document.getElementsByClassName('chat-message').item(0);
    const message = chatMessage.value;

    if (message) {
      socket.emit(this.chatId, {
        author: this.userId,
        receiver: this.receiverId,
        text: message,
        socketId: socket.id,
      });
      chatMessage.value = '';
    }
  }

  startChat = () => {
    const { _socket } = window;

    return fetch('/api/chat', {
      method: 'POST',
      cache: 'no-cache',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
      body: JSON.stringify({
        author: this.userId,
        receiver: this.receiverId,
        socketId: _socket.id,
      }),
    })
      .then((response) => response.json())
      .then(({ chatId, messages }) => {
        this.chatId = chatId;
        const socket = window._socket;
        const chatForm = document.getElementsByClassName('chat-form').item(0);
        const chat = document.getElementsByClassName('chat').item(0);
        const fragment = document.createDocumentFragment();

        messages.forEach((message) => {
          const { text, sentAt, author } = message;
          const messageDiv = createMessageDiv({
            text,
            date: sentAt,
            type: author === this.userId ? 'sent' : 'received',
          });

          fragment.appendChild(messageDiv);
        });
        chat.appendChild(fragment);

        chatForm.addEventListener('submit', this.sendMessage);

        socket.on(this.chatId, this.receiveMessage);
      })
      .catch((error) => {
        throw new Error(`[Browser]. Error: ${error.message}.`);
      });
  }
}
