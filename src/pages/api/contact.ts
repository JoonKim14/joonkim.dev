export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  const data = await request.formData();
  const getValue = (key: string) => {
    const value = data.get(key);
    return typeof value === 'string' ? value.trim() : '';
  };

  const name = getValue('name');
  const email = getValue('email');
  const subject = getValue('subject');
  const message = getValue('message');
  const honeypot = getValue('company');

  if (honeypot) {
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!name || !subject || !message) {
    return new Response(JSON.stringify({ error: 'Missing fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (name.length > 80 || subject.length > 80 || message.length > 3000 || email.length > 120) {
    return new Response(JSON.stringify({ error: 'Input too long' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(JSON.stringify({ error: 'Invalid email format' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const allowedSubjects = new Set(['Job Opportunity', 'Collaboration', 'Just saying hi', 'Other']);
  if (!allowedSubjects.has(subject)) {
    return new Response(JSON.stringify({ error: 'Invalid subject' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  type RuntimeEnv = {
    RESEND_API_KEY?: string;
    CONTACT_TO_EMAIL?: string;
    CONTACT_FROM_EMAIL?: string;
  };

  const cloudflareEnv = (locals as { runtime?: { env?: RuntimeEnv } })?.runtime?.env;
  const processEnv = (globalThis as { process?: { env?: RuntimeEnv } }).process?.env;
  const env = cloudflareEnv ?? processEnv ?? {};

  const resendApiKey = env.RESEND_API_KEY;
  const toEmail = env.CONTACT_TO_EMAIL;
  const fromEmail = env.CONTACT_FROM_EMAIL;

  if (resendApiKey && toEmail && fromEmail) {
    const text = [
      `Name: ${name}`,
      `Email: ${email || 'Not provided'}`,
      `Subject: ${subject}`,
      '',
      message,
    ].join('\n');

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        subject: `[joonkim.dev] ${subject} — ${name}`,
        text,
        reply_to: email || undefined,
      }),
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'Email provider error' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } else {
    console.warn(
      'Contact form received but email delivery is not configured. Set RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL.',
    );
    console.info({ name, email, subject, message });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
