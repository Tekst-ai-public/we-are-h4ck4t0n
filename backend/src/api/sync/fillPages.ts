import { NextFunction, Request, Response } from 'express';
import prisma from '../../utils/prisma';

export async function fillPages(req: Request, res: Response, next: NextFunction) {
  try {
    const pages = await req.fb.getPages();
    for (const page of pages) {
      await prisma.page.upsert({
        where: {
          id: page.id,
        },
        create: {
          id: page.id,
          name: page.name,
          sync: true,
          accessToken: page.access_token
        }, update: {
          name: page.name,
          accessToken: page.access_token
        }
      });
    }
    return res.status(200).json({ message: 'sync' });

  } catch (error) {
    next(error);
  }
}
