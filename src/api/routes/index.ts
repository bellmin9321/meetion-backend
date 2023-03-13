import { Express } from 'express';

import usersRouter from './users';
import pagesRouter from './pages';
import healthRouter from './health';

const routesLoader = (app: Express) => {
  app.use('/users', usersRouter);
  app.use('/myPage', pagesRouter);
  app.use('/health', healthRouter);
};

export default routesLoader;
