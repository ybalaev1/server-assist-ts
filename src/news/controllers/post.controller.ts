import { Request, Response } from 'express';
import { User } from '../../users/model/user.model';
import { Post } from '../model/post.model';

const findById = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const post = await Post.findOne({ _id: postId });

  if (!post) {
    return res.status(404).json({ message: `Post with id ${postId} not found`, code: 404 });
  }
  return res.status(200).json({ data: post });
};

const getPostByUser = async (id: string) => {
  const user = await User.findById({ _id: id });
  if (user) {
    return user.posts;
  }
  return user;
};
const postCreate = async (data: string[]) => new Promise((resolve) => {
  const newPost = Post.create(data);
  resolve(newPost);
});

async function insertPostData(req: Request, res: Response) {
  return postCreate(req.body).then(async (post: any) => {
    await User.updateOne({ _id: req.body.user }, { $push: { posts: post.id } });
    res.status(200).json({ id: post.id });
  });
}

const getAllPosts = async (req: Request, res: Response) => {
  const news = await Post.find().exec();
  return res.status(200).json({ news });
};

const deletePost = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const { userId } = req.body.jwt;

  const takePost = await Post.findById(postId);
  if (takePost) {
    await User.updateOne({ _id: userId }, { $pull: { posts: postId } });
    try {
      await Post.findByIdAndDelete({ _id: postId });
      getPostByUser(userId).then(async (posts) => {
        if (posts) {
          const newsUpdate = await Post.find().exec();
          return res.status(201).json({ user: posts, news: newsUpdate });
        }
        return posts;
      });
    } catch (error) {
      return res.status(403).json({ error: 'error', code: 403 });
    }
  }
  return res.status(404).json({ message: 'Post not be found', code: 404 });
};

export {
  deletePost, findById, insertPostData, getAllPosts,
};
