// routes/health.routes.js
import express from 'express';
import { supabase } from '../lib/supabaseClient.js';
import { sendContactEmail } from '../controllers/contact.controller.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { error } = await supabase.rpc('version'); // or any trivial query
  if (error) {
    return res.status(500).json({ message: 'Supabase not connected' });
  }
  res.json({ message: 'Server is up and Supabase is connected' });
});

router.post('/', sendContactEmail);

export default router;
