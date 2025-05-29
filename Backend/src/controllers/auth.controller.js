import { supabase } from '../lib/supabaseClient.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
  try {
    const { email, name, phoneNo, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase.from('users').insert([{
      email,
      name,
      phone: phoneNo,
      hashed_password: hashedPassword,
    }]).select().single();

    if (error) return next(error);
    res.status(201).json({ user: data });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user || !(await bcrypt.compare(password, user.hashed_password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    next(err);
  }
};
