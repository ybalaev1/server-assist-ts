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

async function getPostsByUserFun(req: Request, res: Response) {
  const { id } = req.params;
  const user = await User.findById({ _id: id });
  if (user) {
    const posts: Array<any> = [];
    for (let post = 0; post < user.posts.length; post++) {
      const item = user.posts[post];
      // eslint-disable-next-line no-await-in-loop
      const searchPost = await Post.findById(item);
      posts.push(searchPost);
    }
    if (posts) {
      res.status(200).json({ posts });
    } else {
      res.status(404);
    }
  }
}
const postCreate = async (data: string[]) => new Promise((resolve) => {
  const newPost = Post.create(data);
  resolve(newPost);
});

async function insertPostData(req: Request, res: Response) {
  const currentDate = new Date();
  req.body.createdAt = currentDate.getTime() / 1000;
  return postCreate(req.body).then(async (post: any) => {
    await User.updateOne({ _id: req.body.user }, { $push: { posts: post.id } });
    res.status(200).json({ id: post.id });
  });
}

const getAllPosts = async (req: Request, res: Response) => {
  const posts = await Post.find().exec();
  return res.status(200).send({ posts });
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
  deletePost, findById, insertPostData, getAllPosts, getPostsByUserFun,
};
