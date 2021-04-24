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
function initSocket() {
  window._socket = window.io();
  window._socket.on('connect', Subscription.init);
}


// eslint-disable-next-line no-unused-vars
class Subscription {
  static subscriptions = new Set();

  static writeToLS() {
    localStorage.setItem(
      'subscriptions',
      JSON.stringify(Array.from(Subscription.subscriptions)),
    );
  }

  static init() {
    const subscriptions = JSON.parse(localStorage.getItem('subscriptions'));

    try {
      if (subscriptions && subscriptions.length > 0) {
        Subscription.subscribe(subscriptions);
      }
    } catch (error) {
      console.error(error);
    }
  }

  static notify({ text }) {
    window.Toastify({
      text: `New message:\n\n${text}`,
      duration: 3000,
      newWindow: true,
      close: true,
      gravity: 'top',
      position: 'right',
      stopOnFocus: true,
      style: {
        background: '#00d1b2',
      },
    }).showToast();
  }

  static subscribe = (chatIds) => {
    if (!chatIds || chatIds.length === 0) {
      return;
    }

    const nonSubscribedChatIds = chatIds
      .filter((chatId) => !Subscription.subscriptions.has(chatId));
    if (nonSubscribedChatIds.length === 0) {
      return;
    }

    const socket = window._socket;

    return fetch('/api/chat/subscribe', {
      method: 'POST',
      cache: 'no-cache',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
      body: JSON.stringify({
        chatIds: nonSubscribedChatIds,
      }),
    })
      .then((response) => response.json())
      .then(({ chatIds }) => {
        chatIds.forEach((chatId) => {
          Subscription.subscriptions.add(chatId);
          socket.on(`new-message-${chatId}`, Subscription.notify);
        });

        Subscription.writeToLS();
      })
      .catch(console.error);
  }

  static unsubscribe = (chatIds) => {
    if (!chatIds || chatIds.length === 0) {
      return;
    }

    const socket = window._socket;

    return fetch('/api/chat/unsubscribe', {
      method: 'POST',
      cache: 'no-cache',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
      body: JSON.stringify({
        chatIds: chatIds,
      }),
    })
      .then((response) => response.json())
      .then(({ chatIds }) => {
        chatIds.forEach((chatId) => {
          Subscription.subscriptions.delete(chatId);
          socket.removeListener(`new-message-${chatId}`, Subscription.notify);
        });

        Subscription.writeToLS();
      })
      .catch(console.error);
  }
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

  subscribe = () => {
    Subscription.subscribe([this.chatId]);
  }

  unsubscribe = () => {
    Subscription.unsubscribe([this.chatId]);
  }

  closeChat = () => {
    const socket = window._socket;
    const chatForm = document.getElementsByClassName('chat-form').item(0);
    const modal = document.getElementsByClassName('modal').item(0);
    const chat = document.getElementsByClassName('chat').item(0);
    const sub = document.getElementsByClassName('subscribe').item(0);
    const unsub = document.getElementsByClassName('unsubscribe').item(0);

    modal.classList.remove('is-active');
    chat.innerHTML = '';
    chatForm.removeEventListener('submit', this.sendMessage);
    socket.removeListener(this.chatId, this.receiveMessage);
    sub.removeEventListener('click', this.subscribe);
    unsub.removeEventListener('click', this.unsubscribe);

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
        const sub = document.getElementsByClassName('subscribe').item(0);
        const unsub = document.getElementsByClassName('unsubscribe').item(0);

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
        sub.addEventListener('click', this.subscribe);
        unsub.addEventListener('click', this.unsubscribe);

        socket.on(this.chatId, this.receiveMessage);
      })
      .catch((error) => {
        throw new Error(`[Browser]. Error: ${error.message}.`);
      });
  }
}
