import { Router } from 'express';
import { login, refreshPassword } from './controllers/auth.user';
import { authValidFields, matchUserAndPassword } from './middleware/verify.user';
// import { findByEmail } from 'users/controllers/user.controller';

const authRoute = () => {
  const app = Router();

  app.post('/auth/', login);
  // app.post('/auth/', [authValidFields, matchUserAndPassword, login]);
  app.post('/refresh/', refreshPassword);
  // app.get('/userExist/', findByEmail);

  return app;
};

export { authRoute };
