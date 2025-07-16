// routes/weather.routes.js
import express from 'express';
import { getRainStatus } from '../controllers/weather.controller.js';

const router = express.Router();

router.get('/rain-status', getRainStatus);

export default router;
