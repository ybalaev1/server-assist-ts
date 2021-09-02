import mongosee, { Schema, Model, Document } from 'mongoose';

type PostCreatedModel = Document & {
    message: string,
    user: string,
    comments: string[],
    likes: string[],
    image: string,
    timestamp: number,
};

const postShema = new Schema({
  message: {
    type: Schema.Types.String,
    required: true,
  },
  user: {
    type: Schema.Types.String,
    required: true,
  },
  comments: {
    type: Schema.Types.Array,
    required: false,
  },
  likes: {
    type: Schema.Types.Array,
    required: false,
  },
  image: {
    type: Schema.Types.String,
    required: false,
  },
  timestamp: {
    type: Schema.Types.Number,
    required: false,
  },
}, {
  collection: 'news',
});

const Post: Model<PostCreatedModel> = mongosee.model < PostCreatedModel >('Post', postShema);
export { Post, PostCreatedModel };
