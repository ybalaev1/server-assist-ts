import { NextFunction, Request, Response } from 'express';
import { findByEmail } from '../../../users/controllers/user.controller';
import { User } from '../../../users/model/user.model';

const crypto = require('crypto');

const authValidFields = async (req: Request, res: Response, next: NextFunction) => {
  const { data_auth } = req.body;
  if (data_auth) {
    if (!data_auth.email) {
      return res.status(422).json({ message: 'The fields email are required' });
    }
    if (!data_auth.password) {
      return res.status(422).json({ message: 'The fields password are required' });
    }
  } else {
    return res.status(400).json({ message: 'Missing email and password' });
  }
  return next();
};

const matchUserAndPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { data_auth } = req.body;
  // console.log('matchUserAndPassword', req.body);
  const user = await User.findOne({ 'email': data_auth?.email }).exec();
  
  // findByEmail(data_auth.email).then((user: any) => {
    console.log('matchUserAndPassword', user)
    if (user !== null) {
      const passField = user.password.split('$');
      // console.log('pass', passField, user)
      const salt = passField[0];
      const hash = crypto.createHmac('sha512', salt).update(data_auth.password).digest('base64');
      if (hash === passField[1]) {
        req.body.data_auth = {
          // eslint-disable-next-line no-underscore-dangle
          userId: user.id,
          email: user.email,
          provider: 'email',
          userName: user.userName,
        };
        return next();
      } else {
        return res.status(400).json({ message: 'Invalid e-mail or password' });
      }
    } else {
        // res.status(404).send({ message: 'User not found' });
        res.status(404).json({ status: 404, message: 'User don`t exist '});
      }
    // return next();
  // }).catch((error) => {
  //    return res.status(404).send({ message: 'User not found' });
  // })
  // res.status(404).json({ status: 404, message: 'User don`t exist '});
};

export { matchUserAndPassword, authValidFields };
