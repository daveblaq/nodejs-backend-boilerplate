/* eslint-disable @typescript-eslint/no-explicit-any */
import sendpulse from 'sendpulse-api';
import dotenv from 'dotenv';
import logger from './logger';

dotenv.config();

const API_USER_ID = process.env.SENDPULSE_USER_ID || '';
const API_SECRET = process.env.SENDPULSE_SECRET || '';
const TOKEN_STORAGE = '/tmp/';

if (API_USER_ID && API_SECRET) {
  sendpulse.init(API_USER_ID, API_SECRET, TOKEN_STORAGE, (token: any) => {
    if (token && token.is_error) {
      logger.warn(`SendPulse initialization issue: ${JSON.stringify(token)}`);
    } else {
      logger.info('SendPulse initialized successfully');
    }
  });
} else {
  logger.warn('SendPulse credentials missing in environment variables');
}

export const sendEmail = async (
  userEmail: string,
  emailData: { header: string; body: string }
): Promise<{ success: boolean; result?: any; error?: any }> => {
  const senderName = process.env.SENDER_NAME || 'AgroNext Terminal';
  const senderEmail = process.env.SENDER_EMAIL || 'invest@finclancapital.com';

  const mailOptions = {
    html: emailData.body,
    text: emailData.body.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim(),
    subject: emailData.header,
    from: {
      name: senderName,
      email: senderEmail,
    },
    to: [
      {
        email: userEmail,
      },
    ],
  };

  return new Promise((resolve) => {
    try {
      sendpulse.smtpSendMail((error: any, result: any) => {
        if (error) {
          logger.error(`SendPulse SMTP error for ${userEmail}: ${JSON.stringify(error)}`);
          resolve({ success: false, error });
        } else {
          logger.info(`SendPulse email successfully sent to ${userEmail}`);
          resolve({ success: true, result });
        }
      }, mailOptions);
    } catch (err: any) {
      logger.error(`SendPulse exception: ${err?.message || err}`);
      resolve({ success: false, error: err });
    }
  });
};

const emailExports = {
  sendEmail,
};

export default emailExports;