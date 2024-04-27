import express, {NextFunction, Request, Response} from "express";
import prisma from "../../utils/prisma";
const app = express.Router();

app.get('/', async function(req: Request, res: Response, next: NextFunction) {
    try {
        const postCount = await prisma.posts.count();

        // Count of all comments
        const commentCount = await prisma.comments.count();

        // Count comments by `comment_type`
        const commentTypeCounts = await prisma.comments.groupBy({
            by: ['meta'],
            _count: {
                _all: true,
            },
            where: {
                meta: {
                    path: ['comment_type'],
                    not: null,
                },
            },
        });

        // Preparing the result
        const result = {
            postCount,
            commentCount,
            commentTypeCounts: commentTypeCounts.map(item => ({
                type: item.meta?.comment_type,
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
