import { Response, Request, NextFunction } from 'express';
import { findByEmail } from '../../../users/controllers/user.controller';
import { User } from '../../../users/model/user.model';

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const jwtSecret = 'yUdmI2BvcLZ8g1lh3f9JztLlkL3NA9gQ';
const login = async (req: Request, res: Response, next: NextFunction) => {
  // const token = jwt.sign(req.body.data_auth, jwtSecret);
  // console.log('user', req.body?.data_auth, user);

  const {email} = req.body?.data_auth;
  User.find({ 'email': email }).exec(async (err, user) => {
    const userData = await User.findOne({ 'id': user[0]?.id});
    const body = {
      userId: user[0].id,
      email: email,
      provider: 'email',
    }
    const token = jwt.sign(body, jwtSecret);
    res.status(200).send({
        id: body.userId,
        accessToken: token,
        user: userData,
      });
          // if (err) {
          //         res.status(404);
          // }
          // res.status(200).send({ user: result });
          // res.status(200).send({
          //   id: user[0]?.id,
          //   accessToken: token,
          //   user: user,
          // });
          // console.log('afaf', user)
          return next();
 });
  // console.log('login user', user);
  // if (!user) {
  //   res.status(404);
  // } else {
  //   const token = jwt.sign(req.body, jwtSecret);
  //   const user = await User.findOne({ _id: req.body.userId});
  //   res.status(200).send({
  //     id: req.body.userId,
  //     accessToken: token,
  //     user: user,
  //   });
  //   return next();
  // }
  // try {
    // const token = jwt.sign(req.body, jwtSecret);
    // const user = await User.findOne({ _id: req.body.userId});
    // return res.status(200).send({
    //   id: req.body.userId,
    //   accessToken: token,
    //   user: user,
    // });
  // } catch (error) {
  //   console.log('login error', error);
  //   res.status(500);
  // }
  // return next();
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

// eslint-disable-next-line consistent-return
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
