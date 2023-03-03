import { Express } from 'express';
import expressLoader from './express';
import Logger from './logger';

const loaders = async (app: Express) => {
  await expressLoader(app);
  Logger.info('✅ Express loaded');
};

export default loaders;
