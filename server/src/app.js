import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import todoRoutes from './routes/todoRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();

// Do not disclose the Express version through the X-Powered-By response header.
app.disable('x-powered-by');

// Apply Helmet defaults, including the standard security headers and CSP policy.
app.use(helmet());

const configuredOrigins = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const developmentOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? configuredOrigins
  : [...new Set([...developmentOrigins, ...configuredOrigins])];

app.use(cors({
  origin(origin, callback) {
    // Non-browser clients (curl, server-to-server requests) do not send Origin.
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Origin is not allowed by the CORS policy.'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  maxAge: 600,
}));

// Keep request bodies small to reduce unnecessary memory and parsing work.
app.use(express.json({ limit: '10kb', strict: true }));

const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 120,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again in a few minutes.',
  },
});
app.use('/api', apiRateLimit);

app.get('/api/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok', service: 'daymark-api' } });
});
app.use('/api/todos', todoRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
