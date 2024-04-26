import { NextFunction, Request, Response } from 'express';
import { toJSON } from '../../utils/toJson';
import prisma from '../../utils/prisma';

async function getAllPosts(req: Request, res: Response, next: NextFunction) {
  try {
    const posts = await prisma.posts.findMany({});

    return res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
}

export default getAllPosts;
