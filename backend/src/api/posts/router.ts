import express from 'express';
import getAllPosts from './getAllPosts';
import getPostById from './getPostById';
import newPost from './newPost';

const app = express.Router();

app.get('/', getAllPosts);

app.get('/:id', getPostById);

app.post('/', newPost);


export default app;
