import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import indexRouter from '../api/routes/index';
import usersRouter from '../api/routes/users';
import healthRouter from '../api/routes/health';
import errorHandler from '../api/middleware/errorHandler';

const corsOptions = {
  origin: '*',
};

const expressLoader = (app: Express) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(logger('dev'));
  app.use(cors(corsOptions));
  app.use(helmet());

  app.use('/', indexRouter);
  app.use('/users', usersRouter);
  app.use('/health', healthRouter);

  app.use((req, res) => {
    res.sendStatus(404);
  });

  app.use(errorHandler);
};

export default expressLoader;
