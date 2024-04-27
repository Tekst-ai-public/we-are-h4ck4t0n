import express from 'express';
import sync from './sync';
import { fillPages } from './fillPages';
import { syncPages } from './syncPages';
const router = express.Router();

router.get('/', sync);

router.get('/fillpages', fillPages)
router.get('/syncpages', syncPages)

export default router;
