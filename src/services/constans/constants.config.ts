import { Router } from 'express';
import { getConstants } from './controllers/constants.controller';

const constansRoute = () => {
  const app = Router();

  app.get('/constants/', getConstants);

  return app;
};

export { constansRoute };
