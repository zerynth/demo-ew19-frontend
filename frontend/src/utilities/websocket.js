import io from 'socket.io-client';

let socket = null;

if (process.browser) {
  socket = io('http://localhost:3001');
}

export default socket;

