import fetch from 'node-fetch';

export async function verifyTurnstileToken(token, ip) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

  const formData = new URLSearchParams();
  formData.append('secret', secret);
  formData.append('response', token);
  if (ip) formData.append('remoteip', ip);

  const res = await fetch(url, {
    method: 'POST',
    body: formData
  });
  const data = await res.json();
  return data.success;
} 