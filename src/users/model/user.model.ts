import mongosee, { Schema, Model, Document } from 'mongoose';

type UserModel = Document & {
        fullName: string;
        // email: string;
        // password: string;
        information: string;
        interest: string;
        mobile_phone: string;
        followers: string;
        following: string;
        posts: string;
        image: string;
        id: string;
        proiritety: boolean;
        email: string;
        password: string;
        userName: string;
        userGender: string;
        userCountry: string;
        userRole: string[];
        individualStyles: string[];
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
    individualStyles: {
      type: Schema.Types.Array,
      required: true,
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
