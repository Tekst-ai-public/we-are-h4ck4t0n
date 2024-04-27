import { NextFunction, Request, Response } from 'express';
import { toJSON } from '../../utils/toJson';
import prisma from '../../utils/prisma';
import FacebookClient  from '../../utils/facebookClient';
import { info } from 'console';

async function sync(req: Request, res: Response, next: NextFunction) {
  try {
    const facebookClient = new FacebookClient(process.env.META_ACCESS_TOKEN as string, 'v19.0');
    const info = await facebookClient.getUserInfo();
    console.log(info);
    return res.status(200).json({ message: 'sync' });

  } catch (error) {
    next(error);
  }
}

export default sync;
