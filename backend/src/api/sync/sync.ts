import { NextFunction, Request, Response } from 'express';
import { toJSON } from '../../utils/toJson';
import prisma from '../../utils/prisma';
import FacebookClient  from '../../utils/facebookClient';
import { info } from 'console';

async function sync(req: Request, res: Response, next: NextFunction) {
  try {
    const facebookClient = new FacebookClient(process.env.META_ACCESS_TOKEN as string, '19.0');
    const info = await facebookClient.getUserInfo();
    console.log(info);
    const pages = await facebookClient.getPages();
    const id = pages.data.find((page) => page.name === 'Elfelfelf').id;
    const accessToken = pages.data.find((page) => page.name === 'Elfelfelf').access_token;
    console.log(accessToken);
    console.log(pages);
    console.log(id);
    const page = await facebookClient.getPageById(id);
    console.log(page);
    const posts = await facebookClient.getPostsByPage(id,accessToken);
    const firstPost = posts.data[0];
    const firstPostComments = await facebookClient.getCommentsByPost(firstPost.id,accessToken);
    console.log(JSON.stringify(firstPostComments));
    return res.status(200).json({ message: 'sync' });

  } catch (error) {
    next(error);
  }
}

export default sync;
