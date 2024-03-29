import express from 'express';
import {
  createPage,
  deletePage,
  getPages,
  getSharedPages,
  addSharedEmail,
  deleteSharedEmail,
} from './controllers/pages';
const pagesRouter = express.Router();

pagesRouter
  .get('/', getPages)
  .get('/shared', getSharedPages)
  .post('/', createPage)
  .delete('/', deletePage)
  .patch('/', addSharedEmail)
  .delete('/sharedEmail', deleteSharedEmail);

export default pagesRouter;
