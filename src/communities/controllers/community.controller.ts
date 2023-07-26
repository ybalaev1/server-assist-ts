import { Request, Response } from 'express';
import { Community } from '../model/community.model';
import { User } from '../../users/model/user.model';
import { Event } from '../../events/model/event.model';

const createCommunity = async (data: any) => {
        const community = await Community.create(data);
        return community;
};


const insertCommunity = async (req: Request, res: Response) => {
        const { data } = req.body;
        const { jwt } = req.body;
        const user = await User.findById({ 'id': jwt?.userId });
        const requestData = {
                ...data,
                creator: {
                        uid: user?.id,
                        image: user?.userImage ?? null,
                        name: user?.userName,
                },
        }
        if (data.title) {
                if (data.description) {
                        return createCommunity(requestData).then(async (community: any) => {
                                const myCommunities = !user?.myCommunities?.length ?  [community?.id] : [...user?.myCommunities, community?.id];
                                await User.updateOne({ 'id': jwt?.userId }, {$set: {myCommunities: myCommunities}});
                                await Community.updateOne({ '_id': community?.id }, {$set: {id: community?.id}});

                                return res.status(200).json({ ...community?.toJSON() });
                        }).catch((er) => {
                                return res.status(500).json({ error: er})
                        })
                } else {
                        res.status(400).send({ message: 'Field description is required.', code: 400, filed: 'description' });
                }
        } else {
                res.status(400).send({ message: 'Field title is required.', code: 400, filed: 'title' });
        }
};

const getAllCommunities = async (_req: Request, res: Response) => {
        const communities = await Community.find().exec();

        return res.status(200).json({ data: communities });
};


const getCommunityById = async (req: Request, res: Response) => {
        const { id } = req.params;
        const community = await Community.findOne({ 'id': id }).exec();

        if (!community) {
                return res.status(404).json({ message: 'Community not found' });
        }
        return res.status(200).json({ ...community?.toJSON()});
};

const updateCommunity = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
                await Community.updateOne({ 'id': id }, req.body.data);
                const communityUpdated = await Community.findById({ 'id': id });

                return res.status(200).send({ data: communityUpdated });
        } catch (error) {
                return res.status(404).json({ message: 'Community not found', code: 404 });
        }
};

const deleteCommunity = async (req: Request, res: Response) => {
        const { id } = req.params;
        const community = await Community.findById({ 'id': id });
        const creatorId = community?.creatorUid || community?.creator?.uid;
        const user = await User.findById({ 'id': creatorId });
        const communities = user?.myCommunities?.filter(i => i.toString() !== id);
        
        await User.updateOne({ 'id': creatorId }, {$set: {myCommunities: communities}});
        await Community.findByIdAndDelete(id);

        return res.status(200).json({ message: 'Community deleted successfully.' });
};

const subscribeCommunity = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { jwt } = req.body;
        const community = await Community.findOne({ 'id': id});
        const user = await User.findOne({ 'id': jwt?.userId });
        
        const userUid = jwt?.userId;
        const userCommunities = !user?.joinedCommunities?.length ?  [id] : [...user?.joinedCommunities, id];
        const followers = !community?.followers?.length ? [userUid] : [...community?.followers, {'userUid': userUid}];
      
        await User.updateOne({ 'id': jwt?.userId }, {$set: {joinedCommunities: userCommunities}});
        await Event.updateOne({ 'id': id }, {$set: {followers: followers}});
        const communityUpdated = await Community.findOne({ 'id': id });
      
        return res.status(200).send({ ...communityUpdated?.toJSON() });
      }
      const unSubscribeCommunity = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { jwt } = req.body;
        const community = await Community.findOne({ 'id': id});
        const user = await User.findOne({ 'id': jwt?.userId });
        
        const userUid = jwt?.userId;
        const userCommunities = user?.joinedCommunities?.filter(i => i !== id);
        const followers = community?.followers?.filter((i: any) => i.userUid !== userUid);
      
        await User.updateOne({ 'id': jwt?.userId }, {$set: {joinedCommunities: userCommunities}});
        await Community.updateOne({ 'id': id }, {$set: {followers: followers}});
        const communityUpdated = await Community.findOne({ 'id': id });
      
        return res.status(200).send({ ...communityUpdated?.toJSON() });
      }
export { deleteCommunity, updateCommunity, getAllCommunities, getCommunityById, insertCommunity, subscribeCommunity, unSubscribeCommunity };
