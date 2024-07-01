import express from 'express'
import { getPostCreatePage, getPostDetailPage, getPostEditPage, getPostsPage } from '../controllers/postController.js'

const postsRouter = express.Router();

postsRouter.get('/', getPostsPage);

postsRouter.get('/edit/:post_id', getPostEditPage);

postsRouter.get('/create', getPostCreatePage);

postsRouter.get('/detail/:post_id', getPostDetailPage);

export default postsRouter