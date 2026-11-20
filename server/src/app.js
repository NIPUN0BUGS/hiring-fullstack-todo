import express from 'express';
import cors from 'cors';
import todoRoutes from './routes/todoRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();

const configuredOrigins = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    // Requests without an Origin header (for example curl or a server-side client) are allowed.
    if (!origin || process.env.NODE_ENV !== 'production' || configuredOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('This origin is not allowed by the CORS policy.'));
  },
}));
app.use(express.json({ limit: '20kb' }));

app.get('/api/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok', service: 'daymark-api' } });
});
app.use('/api/todos', todoRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
