import dotenv from 'dotenv';

dotenv.config();

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const config = {
  MONGO_URI: process.env.MONGO_URI,
};

export default config;
