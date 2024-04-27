import express from 'express';
import sync from './sync';

const router = express.Router();

router.get('/', sync);

export default router;
