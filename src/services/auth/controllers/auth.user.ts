import { Response, Request, NextFunction } from 'express';
import { findByEmail } from '../../../users/controllers/user.controller';
import { User } from '../../../users/model/user.model';

const jwtSecret = 'myS33!!creeeT';
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const login = (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshId = req.body.userId + jwtSecret;
    const salt = crypto.randomBytes(16).toString('base64');
    const hash = crypto.createHmac('sha512', salt).update(refreshId).digest('base64');
    req.body.refreshKey = salt;
    const token = jwt.sign(req.body, jwtSecret);
    const buf = Buffer.from(hash);
    const refresh_token = buf.toString('base64');
    res.status(201).send({
      id: req.body.userId,
      accessToken: token,
      refreshToken: refresh_token,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
  return next();
};

const validJWTNeeded = (req: Request, res: Response, next: NextFunction) => {
  if (req.headers.authorization) {
    try {
      const auth = req.headers.authorization.split(' ');
      if (auth[0] !== 'Bearer') {
        return res.status(401).json({ message: 'Need auth token', code: 401 });
      }
      req.body.jwt = jwt.verify(auth[1], jwtSecret);
      return next();
    } catch (err) {
      res.status(403).json({ message: err });
    }
    return next();
  }
  return res.status(401).json({ message: 'Need auth token', code: 401 });
};

const refreshPassword = (req: Request, res: Response) => {
  const { email, new_pass } = req.body;
  if (email) {
    if (new_pass) {
      findByEmail(email).then(async (result: any) => {
        if (result[0]) {
          const salt = crypto.randomBytes(16).toString('base64');
          const hash = crypto.createHmac('sha512', salt).update(new_pass).digest('base64');
          // eslint-disable-next-line prefer-template
          req.body.password = salt + '$' + hash;
          await User.updateOne({ _id: result[0].id }, req.body);
          const ref_pass = await User.findById(result[0].id);

          return res.status(200).json({ message: 'New password has been updated', code: 200, data: ref_pass });
        }
        return result;
      });
    } else {
      return res.status(400).json({ message: 'The fields new_pass are required', code: 401 });
    }
  } else {
    return res.status(400).json({ message: 'The fields email are required', code: 401 });
  }
};
export { login, validJWTNeeded, refreshPassword };
