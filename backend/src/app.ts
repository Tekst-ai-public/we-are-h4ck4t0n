import helmet from "helmet";
import { ExpressAuth } from '@auth/express';
import FaceBookProvider from '@auth/express/providers/facebook';
import express, { Application, Request, Response } from 'express';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from './utils/prisma';
import cors from 'cors';

const PORT = 8000;

const app: Application = express();
app.use(helmet());

app.use(cors({ origin: 'https://we-are-h4ck4t0n.vercel.app/dashboard' }));

app.set('trust proxy', true);
app.use(
  '/auth/*',
  ExpressAuth({
    providers: [
      FaceBookProvider({
        clientId: process.env.CLIENT_ID as string,
        clientSecret: process.env.CLIENT_SECRET as string,
        authorization: {
          params: {
            scope:
              'page_manage_engagement,pages_manage_posts,pages_read_engagement,pages_read_user_content,pages_show_list,public_profile,email,public_profile',
          },
        },
      }),
    ],
    adapter: PrismaAdapter(prisma),
  })
);

app.get("/test", function (req: Request, res: Response) {
    return res.json({
        message: "Test succeeded!",
    });
});

const server = app.listen(PORT, () => {
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`⚡️[server]: running on port ${PORT}`);
});
