import { Request, Response } from 'express';
import crypto from 'crypto';
import { Community } from '../model/community.model';

const createCommunity = async (data: string[]) => {
        const community = await Community.create(data);
        return community;
};


const insertCommunity = async (req: Request, res: Response) => {
        const { data } = req.body;
        console.log('insertCommunity', req.body);
                if (data.title) {
                           if (!data.description) {
                                    res.status(400).send({ message: 'Field description is required.', code: 400 });
                                } else {
                                        return createCommunity(data).then((community?: string | unknown | any) => {
                                                        res.status(200).json({ id: community._id });
                                                }).catch(er => res.status(422).send({ message: er?.message }))
                                }
                } else {
                        res.status(400).send({ message: 'Field title is required.', code: 400 });
                }
        throw Error();
};

const getAllCommunities= async (_req: Request, res: Response) => {
        const communities = await Community.find().exec();
        console.log('getAllCommunities', communities);

        return res.status(200).json({ data: communities });
};

const getCommunityById = async (req: Request, res: Response) => {
        const { id } = req.params;
        const community = await Community.findOne({ _id: id });

        if (!community) {
                return res.status(404).json({ message: 'Community not found' });
        }
        return res.status(200).json({ data: community });
};

const updateCommunity = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
                await Community.updateOne({ _id: id }, req.body);
                const communityUpdated = await Community.findById({ _id: id });

                return res.status(200).send({ data: communityUpdated });
        } catch (error) {
                return res.status(404).json({ message: 'Community not found', code: 404 });
        }
};

const deleteCommunity = async (req: Request, res: Response) => {
        const { id } = req.params;

        await Community.findByIdAndDelete(id);

        return res.status(200).json({ message: 'Community deleted successfully.' });
};

export { deleteCommunity, updateCommunity, getAllCommunities, getCommunityById, insertCommunity };
