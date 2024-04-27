import express from 'express';
import sync from './sync';
import fillpages from './fillpages';
import syncpages from './syncPage';
const router = express.Router();

router.get('/', sync);

router.get('/fillpages',fillpages)
router.get('/syncpages',syncpages)

export default router;
