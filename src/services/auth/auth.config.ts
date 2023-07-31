import { Router } from 'express';
import { login, refreshPassword, validJWTNeeded } from './controllers/auth.user';
import { authValidFields, matchUserAndPassword } from './middleware/verify.user';
// import { findByEmail } from 'users/controllers/user.controller';

const authRoute = () => {
  const app = Router();

  app.post('/auth_email/', [matchUserAndPassword, login]);
  app.post('/auth_social/', login);
  // app.post('/auth/', [authValidFields, matchUserAndPassword, login]);
  app.post('/refresh/', [validJWTNeeded, refreshPassword]);
  // app.get('/userExist/', findByEmail);

  return app;
};

export { authRoute };
