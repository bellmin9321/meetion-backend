import express from 'express';
import Page from '../../models/Page';
import { PageType } from '../../types';
const pagesRouter = express.Router();

pagesRouter.get('/', async (req, res) => {
  try {
    const pages = await Page.find<PageType>({}).lean();
    res.status(200).json({ success: true, pages });
  } catch (err) {
    console.log(err);
  }
});

export default pagesRouter;
