import { Request, Response } from 'express';
import { User } from '../model/user.model';

const getFollowers = async (id: string) => {
        const user = await User.findById({ _id: id });
        if (user) {
                return user.followers;
        }
        return user;
};

const setFollowId = async (req: Request, res: Response) => {
        const { id_follow } = req.body;
        const { id } = req.params;
        getFollowers(id).then(async (result: any) => {
                const even = (el: { id: string }) => el.id === id_follow;
                if (result.some(even)) {
                        return res.status(403).json({ message: 'User already exists', code: 403 });
                }
                await User.updateOne({ _id: id }, { $push: { followers: { id: id_follow } } });
                const updateUser = await User.findById(id);
                const id_user = id;
                await User.updateOne({ _id: id_follow }, { $push: { following: { id: id_user } } });
                return res.status(200).json({ data: updateUser });
        });
};

const removeFollowId = async (req: Request, res: Response) => {
        const { id_follow } = req.body;
        const { id } = req.params;

        await User.updateOne({ _id: id }, { $pull: { followers: { id: id_follow } } });
        const updateUser = await User.findById(id);
        try {
                const id_user = id;
                await User.updateOne({ _id: id_follow }, { $pull: { following: { id: id_user } } });
                return res.status(200).json({ data: updateUser });
        } catch (error) {
                return res.status(403).json({ error });
        }
};

export { setFollowId, removeFollowId };
