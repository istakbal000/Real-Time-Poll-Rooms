import { io } from 'socket.io-client';

const socket = io('https://real-time-poll-rooms-4.onrender.com', {
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
    maxReconnectionAttempts: 5
});

export default socket;
