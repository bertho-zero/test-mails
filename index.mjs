import nodemailer from 'nodemailer';
import VError from '@openagenda/verror';

const logger = {
  error: (data, ...rest) => console.error(...rest, data),
  warn: (data, ...rest) => console.warn(...rest, data),
  info: (data, ...rest) => console.info(...rest, data),
  debug: (data, ...rest) => console.debug(...rest, data),
};

const config = {
  pool: true,
  host: 'smtp.mailgun.org',
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER || 'postmaster@mail.openagenda.com',
    pass: process.env.SMTP_PASS || 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-yyyyyyyy-zzzzzzzz',
  },
  maxMessages: Infinity,
  maxConnections: 5,
  rateLimit: 14,
  rateDelta: 1000,
  logger,
}

const defaults = {
  from: '"OpenAgenda" <no-reply@mail.openagenda.com>',
  replyTo: '"OpenAgenda" <admin@openagenda.com>',
};

const transporter = nodemailer.createTransport(config, defaults);

try {
  await transporter.verify();
} catch (error) {
  throw new VError(error, 'Invalid transporter configuration');
}

setInterval(() => {
  transporter.sendMail({
    to: 'troubleshootmailgunpoolclose@oagenda.com',
    subject: 'Mailgun test',
    text: 'This is a test.'
  })
}, 1000 * 60 * 1); // every minute
