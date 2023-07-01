import mongosee, { Schema, Model, Document } from 'mongoose';

type CommunityModel = Document & {
        title: string;
        description: string;
        images: string[];
        categories: string[];
        location: string;
        creatorUid: string;
        id: string;
        events: string[];
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
    creatorUid: {
      type: Schema.Types.String,
      required: true,
    },
    events: {
      type: Schema.Types.Array,
      required: false,
    },
    id: {
      type: Schema.Types.String,
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
