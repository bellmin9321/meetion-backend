import { Express } from 'express';
import expressLoader from './express';
import Logger from './logger';
import mongooseLoader from './mongoose';

const loaders = async (app: Express) => {
  await expressLoader(app);
  Logger.info('✅ Express loaded');

  await mongooseLoader();
  Logger.info('✅ Mongoose loaded');
};

export default loaders;
