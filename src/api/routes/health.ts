import { Router } from 'express';

const healthRouter = Router();

healthRouter.get('/', (req, res) => {
  const healthCheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamps: Date.now(),
  };

  try {
    res.send(healthCheck);
  } catch (err) {
    healthCheck.message = 'error';
    res.status(503).send();
  }
});

export default healthRouter;
