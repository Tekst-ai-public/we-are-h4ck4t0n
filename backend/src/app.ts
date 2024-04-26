import helmet from 'helmet';
import express, { Application, Request, Response } from 'express';
import cors from 'cors';

const PORT = 8000;

const app: Application = express();
app.use(helmet());

app.use(cors({ origin: 'https://we-are-h4ck4t0n.vercel.app/dashboard' }));

app.get('/test', function (req: Request, res: Response) {
  return res.json({
    message: 'Test succeeded!',
  });
});

app.get('/posts', async (req: Request, res: Response) => {
  const pageId = '292767810588573';
  const accessToken = req.query.access_token as string;

  if (!accessToken) {
    return res.status(403).json({ message: 'Access token is required as a query parameter.' });
  }

  const url = `https://graph.facebook.com/v13.0/${pageId}/posts?access_token=${accessToken}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch posts', error: error.message });
  }

});

app.get('/comments', async (req: Request, res: Response) => {
  const postId = req.query.post_id as string;
  const accessToken = req.query.access_token as string;

  if (!postId || !accessToken) {
    return res.status(403).json({ message: 'Post ID and Access token are required as query parameters.' });
  }

  const url = `https://graph.facebook.com/v13.0/${postId}/comments?access_token=${accessToken}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch comments', error: error.message });
  }

});

const server = app.listen(PORT, () => {
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`⚡️[server]: running on port ${PORT}`);
});
