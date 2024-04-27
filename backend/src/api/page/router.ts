import express from 'express';
import settings from './settings';
const app = express.Router();


app.use('/settings', settings);

export default app;