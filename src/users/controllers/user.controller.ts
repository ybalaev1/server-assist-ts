import { Request, Response } from 'express';
import crypto from 'crypto';
import { User } from '../model/user.model';

const findByEmail = async (value: string) => new Promise((resolve, reject): void => {
  User.find({ email: value }).exec((err, id) => {
    if (err) {
      reject(err);
    } else {
      resolve(id);
    }
  });
});

const createUser = async (userData: string[]) => {
  const user = await User.create(userData);
  return user;
};

const insertUser = async (req: Request, res: Response) => {
  const { password } = req.body;
  const salt = crypto.randomBytes(16).toString('base64');
  if (password) {
    const hash = crypto.createHmac('sha512', salt).update(password).digest('base64');
    // eslint-disable-next-line prefer-template
    req.body.password = salt + '$' + hash;
    findByEmail(req.body.email).then((result: any) => {
      if (!result[0]) {
        if (!req.body.fullName) {
          res.status(400).send({ message: 'Field fullName is required.', code: 400 });
        } else {
          return createUser(req.body).then((createdUser: any) => {
            res.status(200).send({ id: createdUser.id });
          });
        }
      }
      res.status(403).json({ message: 'User already exists', code: 403 });
      return result;
    }).catch(() => {
      res.status(400).send({ message: 'Field email is required.', code: 400 });
    });
  } else {
    res.status(400).send({ message: 'Field password is required.', code: 400 });
  }
};

const getAllUsers = async (_req: Request, res: Response) => {
  const users = await User.find().exec();

  return res.status(200).json({ data: users });
};

const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await User.findOne({ _id: id });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  return res.status(200).json({ data: user });
};

const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    email,
  } = req.body;
  const user = User.findById(id);

  if (!user) {
    return res.status(422).json({ message: 'User not found', code: 422 });
  }
  findByEmail(email).then(async (result: any) => {
    if (!result[0]) {
      await User.updateOne({ _id: id }, req.body);
      const userUpdated = await User.findById(id);

      return res.status(200).json({ data: userUpdated });
    }

    return res.status(403).json({ message: 'User with this email already exists', code: 403 });
  });
  await User.updateOne({ _id: id }, req.body);
  const userUpdated = await User.findById(id);

  return res.status(200).json({ data: userUpdated });
};

const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  await User.findByIdAndDelete(id);

  return res.status(200).json({ message: 'User deleted successfully.' });
};

export {
  insertUser, deleteUser, getAllUsers, getUserById, updateUser, findByEmail,
};
