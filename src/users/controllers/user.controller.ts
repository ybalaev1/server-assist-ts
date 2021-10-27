import { Request, Response } from 'express';
import crypto from 'crypto';
import { User } from '../model/user.model';

const createUser = async (userData: string[]) => {
        const user = await User.create(userData);
        return user;
};

const findByEmail = async (value: string) =>
        new Promise((resolve, reject): void => {
                User.find({ email: value }).exec((err, id) => {
                        if (err) {
                                reject(err);
                        } else {
                                resolve(id);
                        }
                });
        });

const insertUser = async (req: Request, res: Response) => {
        const { password } = req.body.data;
        const { data } = req.body;
        const salt = crypto.randomBytes(16).toString('base64');
        if (password) {
                const hash = crypto.createHmac('sha512', salt).update(password).digest('base64');
                data.password = `${salt}$${hash}`;
                if (data.email) {
                        findByEmail(data.email).then((result: any) => {
                                if (!result[0]) {
                                        if (!data.fullName) {
                                                res.status(400).send({ message: 'Field fullName is required.', code: 400 });
                                        } else {
                                                return createUser(data).then((createdUser?: string | unknown | any) => {
                                                        // eslint-disable-next-line no-underscore-dangle
                                                        res.status(200).json({ id: createdUser._id });
                                                });
                                        }
                                } else {
                                        res.status(418).json({ message: 'User already exists', code: 418 });
                                }
                                return result;
                        });
                } else {
                        res.status(400).send({ message: 'Field email is required.', code: 400 });
                }
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
        const { email } = req.body;
        try {
                findByEmail(email).then(async (result: any) => {
                        if (!result[0]) {
                                await User.updateOne({ _id: id }, req.body);
                                const userUpdated = await User.findById(id);
                                return res.status(200).send({ data: userUpdated });
                        }
                        return res.status(403).json({ message: 'User with this email already exists', code: 403 });
                });
                await User.updateOne({ _id: id }, req.body);
                const userUpdated = await User.findById({ _id: id });

                return res.status(200).send({ data: userUpdated });
        } catch (error) {
                return res.status(404).json({ message: 'User not found', code: 404 });
        }
};

const deleteUser = async (req: Request, res: Response) => {
        const { id } = req.params;

        await User.findByIdAndDelete(id);

        return res.status(200).json({ message: 'User deleted successfully.' });
};

export { insertUser, deleteUser, getAllUsers, getUserById, updateUser, findByEmail };
