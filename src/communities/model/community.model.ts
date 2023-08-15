import mongosee, { Schema, Model, Document } from 'mongoose';

type CommunityModel = Document & {
        title: string;
        description: string;
        images: string[];
        categories: string[];
        location: string;
        // creatorUid: string;
        id: string;
        eventsIds: string[];
        events: string[];
        followers: Array<{userUid: string}>;
        creatorUid?: string;
        creator: {
          uid: string;
          image: string;
          name: string;
        };
      userImages: Array<{userImage: object}>;
};

const communityShema = new Schema(
  {
    title: {
      type: Schema.Types.String,
      required: true,
    },
    description: {
      type: Schema.Types.String,
      required: true,
    },
    images: {
      type: Schema.Types.Array,
      required: false,
    },
    categories: {
      type: Schema.Types.Array,
      required: true,
    },
    location: {
      type: Schema.Types.String,
      required: true,
    },
    creator: {
      type: Schema.Types.Mixed,
      required: true,
    },
    eventsIds: {
      type: Schema.Types.Array,
      required: false,
    },
    events: {
      type: Schema.Types.Array,
      required: false,
    },
    followers: {
      type: Schema.Types.Array,
      required: false,
    },
    id: {
      type: Schema.Types.String,
      required: false,
    },
    userImages: {
      type: Schema.Types.Array,
      required: false,
    },
  },
  {
    collection: 'communities',
    timestamps: true,
  },
);

const Community: Model<CommunityModel> = mongosee.model<CommunityModel>('Community', communityShema);
export { Community, CommunityModel };
