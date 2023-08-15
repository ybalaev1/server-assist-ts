import { NextFunction, Request, Response } from 'express';
import crypto from 'crypto';
import { User } from '../model/user.model';

const createUser = async (data: string[]) => {
        const user = await User.create(data);
        return user;
};

const userExistByEmail = async (req:Request, res: Response) => {
        console.log(req.params);
        const {email} = req.params;
        const user = await User.findOne({ 'email': email}).exec();
        return res.send({ user: user });
        // User.find({ 'email': email }).exec((err, result) => {
        //         if (err) {
        //                 res.status(404);
        //         }
        //         res.status(200).send({ user: result[0] });
        // });
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
        // const { password } = req.body.data;
        const { data } = req.body;
        // let pass = '';
        // console.log('insertUser', req.body);
        // if (data?.authProvider === 'email') {
        //         pass = data.password
        // } else {
        //         pass = data?.email;
        // }
        const pass = data.email;
        const salt = crypto.randomBytes(16).toString('base64');
        if (pass) {
                const hash = crypto.createHmac('sha512', salt).update(pass).digest('base64');
                data.password = `${salt}$${hash}`;
                if (data.email) {
                        // findByEmail(data.email).then((result: any) => {
                                // if (!result[0]) {
                                        return createUser(data).then(async (user: any) => {
                                                await User.updateOne({_id: user?._id}, {'id': user?._id});
                                                const data = {
                                                        ...user?.toJSON(),
                                                        id: user?._id,
                                                }
                
                                                return res.status(200).send({ ...data });
                                                // res.status(200).json({ id: createdUser._id });
                                        });
                                // }
                        // }).catch(() => {
                        //         res.status(418).json({ message: 'User already exists', code: 418 });
                        // })
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
        const user = await User.findOne({'id': id});

        if (!user) {
                return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ data: user });
};

const updateUser = async (req: Request, res: Response) => {

        const { jwt } = req.body;
        try {
                await User.updateOne({ 'id': jwt?.userId }, req.body);
                const userUpdate = await User.findOne({ 'id': jwt?.userId }).exec();

                return res.status(200).send({ ...userUpdate?.toJSON() });
        } catch (error) {
                return res.status(404).json({ message: 'User not found', code: 404 });
        }
       
};

const onChangeLocation = async (req: Request, res: Response) => {
        const { jwt, userCountry } = req.body;
        // console.log('onChangeLocation', req.body);
        try {
                await User.updateOne({ 'id': jwt?.userId }, {userCountry: userCountry});
                const userUpdate = await User.findOne({ 'id': jwt?.userId }).exec();

                return res.status(200).send({ ...userUpdate?.toJSON() });
        } catch (error) {
                return res.status(404).json({ message: 'User not found', code: 404 });
        }
}
const deleteUser = async (req: Request, res: Response) => {
        const { id } = req.params;

        await User.findByIdAndDelete(id);

        return res.status(200).json({ message: 'User deleted successfully.' });
};

export { insertUser, deleteUser, getAllUsers, getUserById, updateUser, findByEmail, userExistByEmail, onChangeLocation };
