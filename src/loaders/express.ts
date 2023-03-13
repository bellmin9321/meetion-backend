import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import errorHandler from '../api/middleware/errorHandler';
import routesLoader from '../api/routes/index';

const corsOptions = {
  origin: '*',
  methods: 'GET, POST, PUT, PATCH, DELETE',
  credentials: true,
};

const expressLoader = (app: Express) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(logger('dev'));
  app.use(cors(corsOptions));
  app.use(helmet());

  routesLoader(app);

  app.use((req, res) => {
    res.sendStatus(404);
  });

  app.use(errorHandler);
};

export default expressLoader;
