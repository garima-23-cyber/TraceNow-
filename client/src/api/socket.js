// src/api/socket.js
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
});

export const connectSocket = (sessionId) => {
  if (!socket.connected) {
    socket.connect();
    socket.emit('join_session', sessionId);
    console.log(`🔌 Socket connected to session: ${sessionId}`);
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
    console.log('🔌 Socket disconnected');
  }
};