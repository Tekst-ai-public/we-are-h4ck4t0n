import helmet from 'helmet';
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import postsRouter from './api/posts/router';

const PORT = 8000;

const app: Application = express();
app.use(helmet());

app.use(cors({ origin: 'https://we-are-h4ck4t0n.vercel.app/dashboard' }));

app.get('/test', function (req: Request, res: Response) {
  return res.json({
    message: 'Test succeeded!',
  });
});

app.use(postsRouter);

const server = app.listen(PORT, () => {
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`⚡️[server]: running on port ${PORT}`);
});

app.use(function (err, req, res, _) {
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