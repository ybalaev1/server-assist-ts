import { NextFunction, Request, Response } from 'express';
import { Community } from '../model/community.model';
import { User } from '../../users/model/user.model';
import { Event, EventCreatedModel } from '../../events/model/event.model';
import { Socket } from "socket.io";

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
                followers: [{userUid: user?.id}]
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
        // console.log('getAllCommunities', Community.find().exec());
        const communitiesData = await Community.find({ 'location': location }).exec();
        let allCommunities: any = [];
        if (communitiesData.length) {
                for (let index in communitiesData){
                        let currentCommunity = communitiesData[index];
                        const followers = currentCommunity?.followers.map(i => i.userUid);
                        const records = await User.find({ '_id': { $in: followers } }, 'userImage');
                        const item = {
                          ...currentCommunity.toJSON(),
                          userImages: records,
                        }
                        allCommunities.push(item);
                       //  console.log('index', item);
                      }
                return res.status(200).json({ ...allCommunities });
        }

        if(!communitiesData.length) {
                return res.status(404).json({ message: 'Communities not found' });
        }

};


const getCommunityById = async (req: Request, res: Response) => {
        const { id } = req.params;
        const community = await Community.findOne({ 'id': id }).exec();
        const creator = await User.findOne({ 'id': community?.creator?.uid }).exec();
        const followers = community?.followers.map(i => i.userUid);
        const records = await User.find({ '_id': { $in: followers } }, 'userImage');
     
        const data = {
                ...community?.toJSON(),
                userImages: records,
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
        // console.log('getManagingCommunities', req.body);
        const userId = jwt?.userId;
        const communitiesData = await Community.find({ "creator.uid": userId }).exec();
        // console.log('getManagingCommunities', communitiesData)
        // const communities = communitiesData.filter((item) => item?.creator?.uid === userId);
        if (!communitiesData.length) {
             return res.status(404).json({ message: 'communities not found', code: 404 });
        }

        return res.status(200).json({ data: communitiesData });

        // try {

        // return res.status(200).json({ data: communities });
        // } catch (error) {
        //         console.log('error', error)
        //         return res.status(404).json({ message: 'User not found', code: 404 });
        // }
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

const subscribeCommunity = async (communityUid: string, userUid: string, socket: Socket) => {

        const community = await Community.findOne({ _id: communityUid}).exec();
        const user = await User.findOne({ _id: userUid}).exec();
        const isAvailable = community?.followers?.length && community?.followers.map(follower => follower).find(user => user.userUid === userUid);
        // const followers = community?.followers;
        // console.log('isAvailable', isAvailable);
        const newUser = {'userUid': userUid};
        const newFollowers = community?.followers.concat(newUser);
        // console.log('followers', newFollowers, community?.followers.map(follower => follower).find(user => user.userUid === userUid))
        if (isAvailable) {
                const followers = community?.followers?.filter(i => i.userUid !== userUid);
                const userCommunities = user?.joinedCommunities?.filter(i => i !== communityUid);
                await Community.updateOne({ _id: communityUid }, {$set: {followers: followers}});
                await User.updateOne({ _id: userUid }, {$set: {joinedCommunities: userCommunities}});
                const communityUpdated = await Community.findOne({ _id: communityUid });
                const communities = await Community.find({ 'location': community?.location}).exec();
                const records = await User.find({ _id: { $in: communityUpdated?.followers.map(i => i.userUid) } }, 'userImage');
      
                const data = {
                        communities: communities,
                        currentCommunity: communityUpdated?.toJSON(),
                        userImages: records,
                }
                return data;
        
        } else {

                const userCommunities = !user?.joinedCommunities?.length ?  [communityUid] : [...user?.joinedCommunities, communityUid];
                const followers = !community?.followers?.length ? [{'userUid': userUid}] : newFollowers;
                // console.log('followers', followers)
                await User.updateOne({ _id: userUid }, {$set: {joinedCommunities: userCommunities}});
                await Community.updateOne({ _id: communityUid }, {$set: {followers: followers}});
                const communityUpdated = await Community.findOne({ _id: communityUid });
                const communities = await Community.find({ 'location': community?.location}).exec();
                const records = await User.find({ _id: { $in: newFollowers?.map(i => i.userUid) } }, 'userImage');
                const data = {
                        communities: communities,
                        currentCommunity: communityUpdated?.toJSON(),
                        userImages: records,
                }
                return data;
                // return communityUpdated?.toJSON();
        }

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

const getCommunities = async (location: string) => {
        const communities = await Community.find({ 'location': location }).exec();
        return communities;
};


export { getCommunities, deleteCommunity, updateCommunity, getAllCommunities, getCommunityById, insertCommunity, subscribeCommunity, unSubscribeCommunity, getManagingCommunities };
