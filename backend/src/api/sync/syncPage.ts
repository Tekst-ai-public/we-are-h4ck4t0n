import express from 'express';
import { NextFunction, Request, Response } from 'express';
import prisma from '../../utils/prisma';
import FacebookClient  from '../../utils/facebookClient';
import { info } from 'console';
import sync from '../../utils/sync';

export default async function syncPage(req: Request, res: Response, next: NextFunction) {
        try {
            const pages = await prisma.page.findMany({
                where: {
                    sync: true
                }
            });
            for (const page of pages) {
                const fb = new FacebookClient(page.accessToken);
                await sync(page.id,fb);
            }
            return res.status(200).json({ message: 'sync' });
      
        } catch (error) {
            console.log(error);
          next(error);
        }
      }
      
