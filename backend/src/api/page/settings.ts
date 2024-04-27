import express, { Request, Response } from "express";
import prisma from '../../utils/prisma';
import { CategorizeInput } from "../../utils/categorizeutils";
const app = express.Router();


app.get('/', async function (req: Request, res: Response, next) {
  try {
    const pageId = String(req.query.pageId);
    if (!pageId) {
      return res.status(400).json({ message: 'pageId is required' });
    }

    const page = await prisma.page.findFirst({
      where: {
        id: pageId,
      },
      select: {
        settings: true,
        sync: true,
      },
    });
    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }
    const settings = page.settings;

    return res.status(200).json({ settings, sync: page.sync });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

app.post('/', async function (req: Request, res: Response, next) {
  try {
    const page = await prisma.page.findFirst({
      where: {
        id: String(req.query.pageId),
      },
      select: {
        settings: true,
      },
    });
    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }
    const newSettings = req.body as Omit<CategorizeInput, 'actual'>;
    console.log(req.body);
    console.log(newSettings);
    page.settings = { ...page.settings, ...newSettings };
    await prisma.page.update({
      where: {
        id: String(req.query.pageId),
      },
      data: {
        settings: newSettings,
      },
    });

    return res.status(200).json(page.settings);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

app.patch('/sync', async function (req: Request, res: Response, next) {
  try {
    const page = await prisma.page.findFirst({
      where: {
        id: String(req.query.pageId),
      },
      select: {
        sync: true,
      },
    });
    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }
    const sync = req.body as { sync: boolean };
    await prisma.page.update({
      where: {
        id: String(req.query.pageId),
      },
      data: {
        sync: sync.sync,
      },
    });

    return res.status(200).json(page.sync);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export default app;