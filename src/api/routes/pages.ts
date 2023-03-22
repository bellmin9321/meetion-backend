import express from 'express';
import {
  createPage,
  deletePage,
  editPage,
  getPages,
  getSharedPages,
} from './controllers/pages';
const pagesRouter = express.Router();

pagesRouter
  .get('/', getPages)
  .get('/shared', getSharedPages)
  .post('/', createPage)
  .delete('/', deletePage)
  .patch('/', editPage);

export default pagesRouter;
