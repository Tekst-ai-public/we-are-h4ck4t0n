import helmet from 'helmet';
import express, { Application, Request, Response } from 'express';
import cors from 'cors';

const PORT = 8000;

const app: Application = express();
app.use(helmet());

app.use(cors({ origin: 'https://we-are-h4ck4t0n.vercel.app/dashboard' }));

app.use((req, res, next) => {
  console.log(req.path)
  next()
})

app.get("/login", async (req, res) => {
  const authUrl = "https://www.facebook.com/v19.0/dialog/oauth?"
  const params = new URLSearchParams({
    client_id: process.env.CLIENT_ID!,
    redirect_uri: "http://localhost:8000/authorize",
    // redirect_uri: "https://www.facebook.com/connect/login_success.html",
    // scope: "page_manage_engagement,pages_manage_posts,pages_read_engagement,pages_read_user_content,pages_show_list,public_profile,email",
    // scope: "page_manage_engagement,pages_manage_posts,pages_read_engagement",
    scope: "email",
    response_type: "code",
    state: "{st=abc,ds=123}",
    config_id: "1100666177855608"
  })
  const url = authUrl + params.toString()
  return res.redirect(url)
})

app.get("/authorize", async (req, res) => {
  const code = req.query.code as string
  const params = new URLSearchParams({
    client_id: process.env.CLIENT_ID!,
    client_secret: process.env.CLIENT_SECRET!,
    redirect_uri: "http://localhost:8000/authorize",
    code: code
  })
  const response = await fetch(`https://graph.facebook.com/v4.0/oauth/access_token?${params.toString()}`)
  const data = await response.json()
  console.log(JSON.stringify(data))
  return res.redirect("http://localhost:3000")
})

app.get('/test', function(req: Request, res: Response) {
  return res.json({
    message: 'Test succeeded!',
  });
});

const server = app.listen(PORT, () => {
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`⚡️[server]: running on port ${PORT}`);
});
