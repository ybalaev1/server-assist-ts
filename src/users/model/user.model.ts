import mongosee, { Schema, Model, Document } from 'mongoose';

type UserModel = Document & {
        fullName: string;
        // email: string;
        // password: string;
        id: string;
        email: string;
        password: string;
        userName: string;
        userGender: string;
        userCountry: string;
        userImage?: object;
        name?: string;
        gender?: string;
        country?: string;
        image?: object;
        userRole: string[];
        role?: string[];
        individualStyles: string[];
        myCommunities: string[];
        joinedCommunities: string[];
        events: string[];
        goingEvent: string[];
};

const userShema = new Schema(
  {
    userName: {
      type: Schema.Types.String,
      required: true,
    },
    email: {
      type: Schema.Types.String,
      required: true,
    },
    password: {
      type: Schema.Types.String,
      required: true,
    },
    userGender: {
      type: Schema.Types.String,
      required: true,
    },
    userCountry: {
      type: Schema.Types.String,
      required: true,
    },
    userRole: {
      type: Schema.Types.Array,
      required: true,
    },
    userImage: {
      type: Schema.Types.Mixed,
      required: false,
    },
    individualStyles: {
      type: Schema.Types.Array,
      required: true,
    },
    myCommunities: {
      type: Schema.Types.Array,
      required: false,
    },
    joinedCommunities: {
      type: Schema.Types.Array,
      required: false,
    },
    events: {
      type: Schema.Types.Array,
      required: false,
    },
    goingEvent: {
      type: Schema.Types.Array,
      required: false,
    },
    id: {
      type: Schema.Types.String,
      required: false,
    },
  },
  {
    collection: 'users',
    timestamps: true,
  },
);

const User: Model<UserModel> = mongosee.model<UserModel>('User', userShema);
export { User, UserModel };
