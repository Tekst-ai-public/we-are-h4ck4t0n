import express from 'express';
import { NextFunction, Request, Response } from 'express';
import prisma from '../../utils/prisma';
import { STATUS_CODES } from 'http';

const app = express.Router();

app.get('/', async function(req: Request, res: Response, next: NextFunction) {
    try {
        const posts = await prisma.posts.findMany({});
    
        return res.status(200).json(posts);
    } catch (error) {
        next(error);
    }
});


app.get('/:id', async function(req: Request, res: Response, next: NextFunction) {
    try {
        const posts = await prisma.posts.findUnique({
            where: {
                id: String(req.params.id)
            }
        });
    
        return res.status(200).json(posts);
    } catch (error) {
        console.log(error)
        next(error);
    }
});

app.get('/:id/comments', async function(req: Request, res: Response, next: NextFunction) {
    try {
        const posts = await prisma.comments.findMany({
            where: {
                postId: String(req.params.id)
            },
        });
    
        return res.status(200).json(posts);
    } catch (error) {
        next(error);
    }
});

app.get('/:id/comments/:commentId', async function(req: Request, res: Response, next: NextFunction) {
    try {
        const posts = await prisma.comments.findUnique({
            where: {
                id: String(req.params.commentId),
                postId: String(req.params.id)
            }
        });
    
        return res.status(200).json(posts);
    } catch (error) {
        console.log(error)
        next(error);
    }
});


export default app;
