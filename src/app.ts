import express, { Express } from 'express';
import loaders from './loaders';

const app: Express = express();

const startServer = async () => {
  await loaders(app);
};

startServer();

export default app;
