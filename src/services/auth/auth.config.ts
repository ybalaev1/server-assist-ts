import { Router } from 'express';
import { login, refreshPassword } from './controllers/auth.user';
import { authValidFields, matchUserAndPassword } from './middleware/verify.user';

const authRoute = () => {
  const app = Router();

  app.post('/auth/', [
    authValidFields,
    matchUserAndPassword,
    login,
  ]);
  app.post('/refresh/', refreshPassword);

  return app;
};

export { authRoute };
