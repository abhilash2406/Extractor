import express from 'express';
// Assuming we'll use sequelize moving forward, we'll import it here.
import sequelize from '../config/sequelize-config.js';

const router = express.Router();

// GET /api/health - DB connectivity check
router.get('/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({
      status: 'ok',
      db: 'connected'
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      db: 'disconnected',
      message: err.message,
    });
  }
});

export default router;
