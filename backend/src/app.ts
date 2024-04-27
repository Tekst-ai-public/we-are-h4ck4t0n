import helmet from "helmet";
import express, { Application, Request, Response } from "express"
import categorize from "./api/categorize/categorize"
import cors from 'cors';
import postsRouter from './api/posts/posts';
import syncRouter from './api/sync/router';
import posts from './api/posts/posts';
import FacebookClient from "./utils/facebookClient";
import prisma from "./utils/prisma";
import jwt from "jsonwebtoken"
import { authMiddleware } from "./utils/authMiddleware";
import cookieParser from "cookie-parser"

const PORT = 8000;

declare module "express" {
  interface Request {
    fb: FacebookClient,
    userId: string
  }
}

const app: Application = express();
app.use(helmet());
app.use(express.json({ limit: "5MB" }));

app.use(cookieParser())
app.use(cors({ origin: ['https://we-are-h4ck4t0n.vercel.app/dashboard', 'http://localhost:3000'], credentials: true }));

app.use((req, res, next) => {
  console.log(req.path)
  next()
})

app.get("/login", async (req, res) => {
  const authUrl = "https://www.facebook.com/v19.0/dialog/oauth?"
  const params = new URLSearchParams({
    client_id: process.env.CLIENT_ID!,
    redirect_uri: "http://localhost:8000/authorize",
    // scope: "page_manage_engagement,pages_manage_posts,pages_read_engagement,pages_read_user_content,pages_show_list,public_profile,email",
    scope: "pages_read_engagement,pages_show_list,pages_read_user_content,pages_manage_posts,email",
    response_type: "code",
    state: "{st=abc,ds=123}",
    config_id: "1100666177855608"
  })
  const url = authUrl + params.toString()
  return res.redirect(url)
})

app.get("/authorize", async (req, res, next) => {
  try {
    const code = req.query.code as string
    const params = new URLSearchParams({
      client_id: process.env.CLIENT_ID!,
      client_secret: process.env.CLIENT_SECRET!,
      redirect_uri: "http://localhost:8000/authorize",
      code: code
    })
    const response = await fetch(`https://graph.facebook.com/v4.0/oauth/access_token?${params.toString()}`)
    const data = await response.json()
    const accessToken = data.access_token
    const fb = new FacebookClient(accessToken)
    const me = await fb.getUserInfo()

    await prisma.authUser.upsert({
      where: {
        id: me.id
      },
      create: {
        id: me.id,
        name: me.name,
        token: accessToken
      }, update: {
        name: me.name,
        token: accessToken
      }
    })

    const token = jwt.sign({ id: me.id, name: me.name }, "SECRET", { expiresIn: "10d" })

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: false,
      maxAge: 10 * 24 * 60 * 60 * 1000,
      path: "/",
      sameSite: "lax"
    })
    return res.redirect("http://localhost:3000")

  } catch (err) {
    next(err)
  }
})

app.get('/test', function(req: Request, res: Response) {
  console.log(JSON.stringify(req.cookies))
  return res.json({
    message: 'Test succeeded!',
  });
});

app.get("/me", authMiddleware(), async (req: Request, res, next) => {
  try {
    // const me = await req.fb.getUserInfo()
    const me = await prisma.authUser.findFirst({
      where: {
        id: req.userId
      }
    })
    return res.status(200).json(me)
  } catch (err) {
    next(err)
  }
})

app.get("/pages", authMiddleware(), async (req: Request, res, next) => {
  try {
    const pages = await req.fb.getPages()
    return res.status(200).json(pages)
  } catch (err) {
    next(err)
  }
})

app.use("/categorize", categorize);
app.use("/posts", postsRouter);
app.use("/sync", syncRouter);

const server = app.listen(PORT, () => {
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`⚡️[server]: running on port ${PORT}`);
});

app.use(function(err, req, res, _) {
  try {
    if (err.name === 'AbortError') {
      return res.status(418).json('request was aborted');
    }

    if (err.name === 'FrontendError') {
      return res.status(err.status).json({ code: err.code, message: err.message });
    }

    res.status(500).json({ code: 'UNCAUGHT_ERROR', message: 'Something broke!' });
  } catch (err) {
    return res.status(500).json({ code: 'UNCAUGHT_ERROR', message: 'Something broke!' });
  }
});
