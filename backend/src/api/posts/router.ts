import express from 'express';
import getAllPosts from './getAllPosts';

const postsRouter = express.Router();

postsRouter.get('/', getAllPosts);

export default postsRouter;
