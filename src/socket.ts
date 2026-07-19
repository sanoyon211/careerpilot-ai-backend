import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import config from './app/config';

let io: Server;

export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: [config.client_url, 'http://localhost:3000', 'http://127.0.0.1:3000'],
      credentials: true,
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('🔗 Client connected to socket:', socket.id);

    socket.on('join_user_room', (userId) => {
      if (userId) {
        socket.join(userId);
        console.log(`👤 User ${userId} joined personal socket room`);
      }
    });

    socket.on('disconnect', () => {
      console.log('❌ Client disconnected:', socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};
