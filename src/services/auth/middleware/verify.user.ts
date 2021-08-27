import { NextFunction, Request, Response } from 'express';
import { findByEmail } from '../../../users/controllers/user.controller';

const crypto = require('crypto');

const authValidFields = async (req: Request, res: Response, next: NextFunction) => {
  const { data } = req.body;

  if (data) {
    if (!data.email) {
      return res.status(422).json({ message: 'The fields email are required' });
    }
    if (!data.password) {
      return res.status(422).json({ message: 'The fields password are required' });
    }
  } else {
    return res.status(400).json({ message: 'Missing email and password' });
  }
  return next();
};

const matchUserAndPassword = async (req: Request, res: Response, next: NextFunction) => {
  findByEmail(req.body.email).then((user: any) => {
    if (!user[0]) {
      res.status(404).json({ message: 'User not found' });
    } else {
      const passField = user[0].password.split('$');
      const salt = passField[0];
      const hash = crypto.createHmac('sha512', salt).update(req.body.password).digest('base64');
      if (hash === passField[1]) {
        req.body = {
          userId: user[0].id,
          email: user[0].email,
          provider: 'email',
          name: user[0].fullName,
        };
        return next();
      }

      return res.status(400).json({ message: 'Invalid e-mail or password' });
    }
    return next();
  });
};

export { matchUserAndPassword, authValidFields };
