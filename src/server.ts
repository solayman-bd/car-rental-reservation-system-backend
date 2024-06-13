import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './app/config';

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.db_url as string);
    console.log('Connected to the database successfully.');

    server = app.listen(config.port, () => {
      console.log(`App is listening on port ${config.port}`);
    });
  } catch (err) {
    console.error('Failed to connect to the database', err);
    process.exit(1);
  }
}

main();

function shutdownGracefully() {
  if (server) {
    server.close(() => {
      console.log('Server closed.');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
}

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection detected:', reason);
  shutdownGracefully();
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception detected:', err);
  shutdownGracefully();
});
