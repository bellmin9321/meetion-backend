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

pagesRouter.post('/', async (req, res) => {
  try {
    const { creator, title, desc } = req.body;
    const { _id } = await Page.create({
      creator,
      title,
      desc,
    });

    res.status(201).json({ success: true, _id });
  } catch (err) {
    res.status(500).json({
      success: false,
      errorMessage: 'Failed to create page',
    });
  }
});

pagesRouter.delete('/', async (req, res) => {
  try {
    const { id } = req.body;
    await Page.deleteOne({ _id: { $in: id } }).exec();

    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({
      success: false,
      errorMessage: 'Failed to create page',
    });
  }
});

pagesRouter.patch('/', async (req, res) => {
  try {
    console.log(req.body);
    const { title, desc, _id } = req.body;
    await Page.findOneAndUpdate(
      { _id: { $in: _id } },
      { $set: { title, desc } },
    ).exec();

    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({
      success: false,
      errorMessage: 'Failed to create page',
    });
  }
});

export default pagesRouter;
