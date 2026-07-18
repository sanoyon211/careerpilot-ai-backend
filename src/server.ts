import mongoose from 'mongoose';
import app from './app';
import config from './app/config';
import { initSocket } from './socket';

let server: any;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    console.log('🛢️ Connected to MongoDB successfully!');

    server = app.listen(config.port, () => {
      console.log(`🚀 Application is running on port ${config.port}`);
    });

    initSocket(server);
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
  }
}

main();

process.on('unhandledRejection', (err) => {
  console.log(`😈 unhandledRejection is detected, shutting down...`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on('uncaughtException', () => {
  console.log(`😈 uncaughtException is detected, shutting down...`);
  process.exit(1);
});
