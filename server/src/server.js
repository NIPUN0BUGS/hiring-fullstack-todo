import 'dotenv/config';
import app from './app.js';
import { connectDB } from './config/db.js';
import mongoose from 'mongoose';

const PORT = Number(process.env.PORT) || 5000;

async function startServer() {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`API listening on http://localhost:${PORT}`);
    });

    async function shutdown(signal) {
      console.log(`${signal} received. Closing server...`);
      server.close(async () => {
        await mongoose.connection.close();
        process.exit(0);
      });
    }

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    console.error(`Unable to start the API: ${error.message}`);
    process.exit(1);
  }
}

startServer();
