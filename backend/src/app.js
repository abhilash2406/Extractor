import 'dotenv/config';
import express from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { logger } from './config/winston-config.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './config/swagger.js';
import swaggerAuth from './middlewares/swagger-auth.js';
import routes from './routes/index.js';
import './models/index.js'; // This initializes sequelize and models

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// ── Middleware ──────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:3000').split(',');

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: ${origin} not allowed`));
  },
  credentials: true,
}));
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Docs Setup
app.use(
  '/api-docs',
  swaggerAuth,
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  })
);

// ── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/v1', routes);

// Root
app.get('/', (req, res) => {
  res.json({ message: 'Extractor API is running 🚀', version: '1.0.0' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.message}`);
  res.status(500).json({ error: 'Internal server error' });
});

// ── Start ───────────────────────────────────────────────────────────────────
const port = process.env.PORT || '5000';

app.listen(port, () => {
  logger.info('==================================================');
  logger.info(`🚀 Server is running locally on port: ${port}`);
  logger.info(`📚 Swagger documentation available at: http://localhost:${port}/api-docs`);
  logger.info('==================================================');
});

export default app;
