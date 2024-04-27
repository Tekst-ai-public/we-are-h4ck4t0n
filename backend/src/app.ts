import helmet from "helmet";
import express, { Application, NextFunction, Request, Response } from "express"
import categorize from "./api/categorize/categorize"
import cors from 'cors';
import syncRouter from './api/sync/router';
import posts from './api/posts/posts';
import numbers from "./api/posts/numbers"
import FacebookClient from "./utils/facebookClient";
import prisma from "./utils/prisma";
import jwt from "jsonwebtoken"
import { authMiddleware } from "./utils/authMiddleware";
import cookieParser from "cookie-parser"
import sync from "./utils/sync";
import pageRouter from "./api/page/router";

const PORT = process.env.PORT || 8000;

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
app.use(cors({ origin: process.env.APP_BASE_URL!.includes("localhost") ? ['https://we-are-h4ck4t0n.vercel.app', 'http://localhost:3000'] : "https://we-are-h4ck4t0n.vercel.app", credentials: true }));

app.use((req, res, next) => {
  console.log(req.path)
  next()
})

app.get("/login", async (req, res) => {
  const authUrl = "https://www.facebook.com/v19.0/dialog/oauth?"
  const params = new URLSearchParams({
    client_id: process.env.CLIENT_ID!,
    redirect_uri: process.env.API_BASE_URL! + "/authorize",
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
      redirect_uri: process.env.API_BASE_URL! + "/authorize",
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

      ; ((async () => {
        const pages = await fb.getPages();
        for (const page of pages) {
          await prisma.page.upsert({
            where: {
              id: page.id,
            },
            create: {
              id: page.id,
              name: page.name,
              sync: false,
              accessToken: page.access_token,
              usersWithAccess: {
                connect: {
                  id: me.id
                }
              }

            }, update: {
              name: page.name,
              accessToken: page.access_token,
              usersWithAccess: {
                connect: {
                  id: me.id
                }
              }
            }
          });
        }
      })())

    const token = jwt.sign({ id: me.id, name: me.name }, "SECRET", { expiresIn: "10d" })

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.APP_BASE_URL!.includes("localhost") ? false : true,
      maxAge: 10 * 24 * 60 * 60 * 1000,
      path: "/",
      sameSite: "lax",
      domain: process.env.APP_BASE_URL!.includes("localhost") ? undefined : ".vercel.app"
    })
    return res.redirect(process.env.APP_BASE_URL!)

  } catch (err) {
    next(err)
  }
})

app.get('/test', function(req: Request, res: Response) {
  return res.json({
    message: 'Test succeeded!',
  });
});

app.get("/me", authMiddleware(), async (req: Request, res, next) => {
  try {
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


app.get('/comments', authMiddleware(), async function(req: Request, res: Response, next: NextFunction) {
  try {
    const label = req.query.label as string;
    const pageId = req.query.pageId as string

    let newWhere = {};
    if (label) {
      // When 'label' exists, extend 'where' to include a condition on the JSON field 'meta'.
      newWhere = {
        meta: {
          path: ['comment_type'], // Specify the path if you're querying a nested property in a JSON field.
          equals: label, // Use 'string_contains' or another appropriate filter.
        },
        post: {
          pageId: pageId
        }
      };
    } else {
      // When 'label' does not exist, extend 'where' to include a condition on the JSON field 'meta'.
      newWhere = {
        meta: {
          path: ['comment_type'],
          not: null,
        },
        post: {
          pageId: pageId
        }
      };
    }

    const comments = await prisma.comments.findMany({
      where: newWhere,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json(comments);
  } catch (error) {
    console.log(error)
    next(error);
  }
});



app.use("/page", pageRouter);
app.use("/posts/numbers", numbers);
app.use("/categorize", categorize);
app.use("/posts", posts);
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

let isRunning = false

// setInterval(() => {
//   try {
//     if (!isRunning) {
//       isRunning = true;
//       console.log('starting sync');
//       startSync()
//     }
//   } catch (err) {
//     console.error("something went wrong syncing")
//   }
// }, 1000 * 4)

async function startSync() {
  const start = performance.now()
  const pages = await prisma.page.findMany({
    where: {
      sync: true
    }
  });
  console.log(`syncing ${pages.length} pages`)
  await Promise.allSettled(pages.map(async page => {
    const fb = new FacebookClient(page.accessToken);
    await sync(page.id, fb);
  }))
  isRunning = false
  console.log(`FULL SYNC TOOK ${performance.now() - start}`)
}
