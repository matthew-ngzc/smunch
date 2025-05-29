import { supabase } from '../lib/supabaseClient.js';

export const getMerchants = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('merchants')
      .select('merchant_id, name, payout_frequency');

    if (error) return next(error);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const getMenu = async (req, res, next) => {
  try {
    const { id: merchantId } = req.params;

    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('merchant_id', merchantId)
      .eq('is_available', true);

    if (error) return next(error);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// Add a new merchant
export const addMerchant = async (req, res, next) => {
  try {
    const { name, location, contact, image_url, payout_frequency } = req.body;

    const { data, error } = await supabase.from('merchants').insert([
      {
        name,
        location,
        contact,
        image_url,
        payout_frequency: payout_frequency || 'weekly'
      }
    ]).select().single();

    if (error) return next(error);
    res.status(201).json({ merchant: data });
  } catch (err) {
    next(err);
  }
};

// Update existing merchant
export const updateMerchant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, location, contact, image_url, payout_frequency } = req.body;

    const { data, error } = await supabase
      .from('merchants')
      .update({
        ...(name && { name }),
        ...(location && { location }),
        ...(contact && { contact }),
        ...(image_url && { image_url }),
        ...(payout_frequency && { payout_frequency }),
      })
      .eq('merchant_id', id)
      .select()
      .single();

    if (error) return next(error);
    res.json({ merchant: data });
  } catch (err) {
    next(err);
  }
};
