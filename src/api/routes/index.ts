import { Express } from 'express';

import userRouter from './user';
import pagesRouter from './pages';
import healthRouter from './health';

const routesLoader = (app: Express) => {
  app.use('/user', userRouter);
  app.use('/myPage', pagesRouter);
  app.use('/health', healthRouter);
};

export default routesLoader;
