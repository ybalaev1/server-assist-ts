import { Request, Response } from 'express';
import { Community } from '../model/community.model';
import { User } from '../../users/model/user.model';
import { Event, EventCreatedModel } from '../../events/model/event.model';

const createCommunity = async (data: any) => {
        const community = await Community.create(data);
        return community;
};


const insertCommunity = async (req: Request, res: Response) => {
        const { data } = req.body;
        const { jwt } = req.body;
        const user = await User.findOne({ 'id': jwt?.userId });
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
                                // console.log('comm', community);
                                const myCommunities = !user?.myCommunities?.length ?  [community?._id] : [...user?.myCommunities, community?._id];
                                await User.updateOne({ 'id': jwt?.userId }, {$set: {myCommunities: myCommunities}});
                                await Community.updateOne({_id: community?._id}, {'id': community?._id});
                                const data = {
                                        ...community?.toJSON(),
                                        id: community?._id,
                                }

                                return res.status(200).json({ ...data });
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

const getAllCommunities = async (req: Request, res: Response) => {
        const {location} = req.params;
        // const communities = await Community.find().exec();
        const communities = await Community.aggregate([
                {
                  '$match': {
                        "location": location
                  }
                }
        ])
        // console.log('getAllCommunities', communities);
        return res.status(200).json({ data: communities });
};


const getCommunityById = async (req: Request, res: Response) => {
        const { id } = req.params;
        const community = await Community.findOne({ 'id': id }).exec();
        const creator = await User.findOne({ 'id': community?.creator?.uid }).exec();

        const data = {
                ...community?.toJSON(),
                creator: {
                        ...community?.creator,
                        image: creator?.userImage,
                },
        }
        if (!community) {
                return res.status(404).json({ message: 'Community not found' });
        }
        return res.status(200).json({ ...data });
};

const getManagingCommunities = async (req: Request, res: Response) => {
        const { jwt } = req.body;
        try {
        const communitiesData = await Community.find().exec();
        const communities = communitiesData?.filter((item) => item?.creator?.uid === jwt?.userId);

        return res.status(200).send({ data: communities });
        } catch (error) {
                console.log('error', error)
                return res.status(404).json({ message: 'User not found', code: 404 });
        }
}
const updateCommunity = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
                await Community.updateOne({ 'id': id }, req.body.data);
                const communityUpdated = await Community.findOne({ 'id': id }).exec();

                return res.status(200).send({ ...communityUpdated?.toJSON() });
        } catch (error) {
                return res.status(404).json({ message: 'Community not found', code: 404 });
        }
};

const deleteCommunity = async (req: Request, res: Response) => {
        const { id } = req.params;
        const community = await Community.findOne({ 'id': id });
        const creatorId = community?.creator?.uid;
        const user = await User.findOne({ 'id': creatorId });
        const communities = user?.myCommunities?.filter(i => i !== id);
        community?.eventsIds?.map(async (value) => {
                const idEvent = await Event.findOne({ _id: value})
                await Event.findByIdAndDelete(idEvent);
        });
        //TODO удалить у пользователей из joinedEvents евенты
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
      
        await User.updateOne({ 'id': userUid }, {$set: {joinedCommunities: userCommunities}});
        await Community.updateOne({ 'id': id }, {$set: {followers: followers}});
        const communityUpdated = await Community.findOne({ 'id': id });
      
        return res.status(200).send({ ...communityUpdated?.toJSON() });
      }
      const unSubscribeCommunity = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { jwt } = req.body;
        console.log('unSubscribeCommunity jwt', jwt, id)
        const community = await Community.findOne({ 'id': id});
        const user = await User.findOne({ 'id': jwt?.userId });

        const userUid = jwt?.userId;
        const userCommunities = user?.joinedCommunities?.filter(i => i !== id);
        const followers = community?.followers?.filter((i: any) => i !== userUid);
        console.log('unSubscribeCommunity', userUid, userCommunities, followers )
      
        await User.updateOne({ 'id': jwt?.userId }, {$set: {joinedCommunities: userCommunities}});
        await Community.updateOne({ 'id': id }, {$set: {followers: followers}});
        const communityUpdated = await Community.findOne({ 'id': id });
      
        return res.status(200).send({ ...communityUpdated?.toJSON() });
      }
export { deleteCommunity, updateCommunity, getAllCommunities, getCommunityById, insertCommunity, subscribeCommunity, unSubscribeCommunity, getManagingCommunities };
