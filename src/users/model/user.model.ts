import mongosee, { Schema, Model, Document } from 'mongoose';

type UserModel = Document & {
    fullName: string,
    email: string,
    password: string,
    information: string,
    interest: string,
    mobile_phone: string,
    followers: string,
    following: string,
    posts: string,
    image: string,
    id: string,
    proiritety: boolean,
};

const userShema = new Schema({
  fullName: {
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
  information: {
    type: Schema.Types.String,
    required: false,
  },
  interest: {
    type: Schema.Types.Array,
    required: false,
  },
  mobile_phone: {
    type: Schema.Types.String,
    required: false,
  },
  followers: {
    type: Schema.Types.Array,
    required: false,
  },
  following: {
    type: Schema.Types.Array,
    required: false,
  },
  posts: {
    type: Schema.Types.Array,
    required: false,
  },
  image: {
    type: Schema.Types.String,
    required: false,
  },
  id: {
    type: Schema.Types.String,
    required: false,
  },
  proiritety: {
    type: Schema.Types.Boolean,
    required: false,
  },
},
{
  collection: 'users',
  timestamps: true,
});

const User: Model<UserModel> = mongosee.model<UserModel>('User', userShema);
export { User, UserModel };
