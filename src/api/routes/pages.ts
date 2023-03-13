import express from 'express';
import {
  createPage,
  deletePage,
  editPage,
  getPages,
} from './controllers/pages';
const pagesRouter = express.Router();

pagesRouter
  .get('/', getPages)
  .post('/', createPage)
  .delete('/', deletePage)
  .patch('/', editPage);

export default pagesRouter;
