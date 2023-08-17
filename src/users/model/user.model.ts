import mongosee, { Schema, Model, Document } from 'mongoose';
type paidEventType = {
  userUid: string;
  id: string;
  eventUid: string;
  payed: boolean;
  event: {
    title?: string;
    description?: string;
    creator?: string;
    location?: string;
    eventDate?: {
      start: string;
      end: string;
      time: number;
    };
  },
  user: {
    name?: string;
    gender?: string;
    email?: string;
  }
}
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
        userImage: object;
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
        paidEvents: Array<paidEventType>;
        customer: {id: string};
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
    paidEvents: {
      type: Schema.Types.Array,
      required: false,
    },
    id: {
      type: Schema.Types.String,
      required: false,
    },
    customer: {
      type: Schema.Types.Mixed,
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
