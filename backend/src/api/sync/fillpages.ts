import express from 'express';
import { NextFunction, Request, Response } from 'express';
import prisma from '../../utils/prisma';
import FacebookClient  from '../../utils/facebookClient';
import { info } from 'console';




async function sync(req: Request, res: Response, next: NextFunction) {
        try {
            const facebookClient = new FacebookClient(process.env.META_ACCESS_TOKEN as string, '19.0');
            const info = await facebookClient.getUserInfo();
            console.log(info);
            const pages = await facebookClient.getPages();
            await prisma.page.createMany({
                data: pages.data.map((page) => ({
                    id: page.id,
                    name: page.name,
                    sync: true,
                    accessToken: page.access_token
                }))
            });
          return res.status(200).json({ message: 'sync' });
      
        } catch (error) {
          next(error);
        }
      }
      
      export default sync;
      