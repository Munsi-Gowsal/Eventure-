import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Health endpoints MUST be defined before global rate limiting
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, data: { status: 'OK' } });
});

app.get('/ready', (req, res) => {
  if (mongoose.connection.readyState === 1) {
    res.status(200).json({ success: true, data: { status: 'Ready' } });
  } else {
    res.status(503).json({ success: false, data: { status: 'Not Ready' } });
  }
});

// 1. helmet()
app.use(helmet());

// 2. cors()
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (env.CORS_ORIGINS.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// 3. express.json({ limit: "10kb" })
app.use(express.json({ limit: '10kb' }));

// 4. express-mongo-sanitize()
// Workaround for Express 5 where req.query is read-only
app.use((req, res, next) => {
  Object.defineProperty(req, 'query', {
    value: { ...req.query },
    writable: true,
    configurable: true,
    enumerable: true,
  });
  next();
});
app.use(mongoSanitize());

// 5. Global API rate limiter: 100 requests/minute
const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later.',
    },
  },
});
app.use('/api', globalLimiter);

// 6. Auth rate limiter: 10 requests/minute
const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many authentication attempts, please try again later.',
    },
  },
});
app.use('/api/v1/auth', authLimiter);

import authRoutes from './modules/auth/auth.routes';
import eventRoutes from './modules/events/event.routes';
import userRoutes from './modules/users/user.routes';

// 7. Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/me', userRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Resource not found',
    },
  });
});

// 8. Central errorHandler LAST
app.use(errorHandler);

export default app;
