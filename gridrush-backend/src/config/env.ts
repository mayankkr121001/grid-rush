import dotenv from 'dotenv';

dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  MONGODB_URI: process.env.MONGODB_URI || '',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  JWT_SECRET: process.env.JWT_SECRET || 'gridrush_dev_jwt_secret_key_minimum_32_chars',
  RECOVERY_CODE_PEPPER: process.env.RECOVERY_CODE_PEPPER || 'gridrush_dev_recovery_pepper_minimum_32_chars',
  SESSION_COOKIE_NAME: process.env.SESSION_COOKIE_NAME || 'gridrush_session',
  SESSION_MAX_AGE_DAYS: parseInt(process.env.SESSION_MAX_AGE_DAYS || '30', 10),
};
