import express, { NextFunction, Request, Response } from "express";
import prisma from "../../utils/prisma";
import { authMiddleware } from "../../utils/authMiddleware";
const app = express.Router();

app.get('/', authMiddleware(), async function(req: Request, res: Response, next: NextFunction) {
  try {

    const pageId = req.query.pageId as string

    const postCount = await prisma.posts.count({
      where: {
        pageId: pageId
      }
    });

    // Count of all comments
    const commentCount = await prisma.comments.count({
      where: {
        post: {
          pageId: pageId
        }
      }
    });

    // Count comments by `comment_type`
    const commentTypeCounts = await prisma.comments.groupBy({
      by: ['meta'],
      _count: {
        _all: true,
      },
      where: {
        meta: {
          path: ['comment_type'],
          // @ts-ignore
          not: null
        },
        post: {
          pageId: pageId
        }
      },
    });

    // Preparing the result
    const result = {
      postCount,
      commentCount,
      commentTypeCounts: commentTypeCounts.map(item => ({
        // @ts-ignore
        type: (item.meta?.comment_type) as string,
        // @ts-ignore
        count: item._count._all,
      })),
    };

    return res.status(200).json(result);
  } catch (error) {
    console.error(error)
    next(error);
  }
});

export default app;
