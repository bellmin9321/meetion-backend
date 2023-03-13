import { Request, Response } from 'express';
import Page from '../../../models/Page';
import { PageType } from '../../../types';

const getPages = async (req: Request, res: Response) => {
  try {
    const pages = await Page.find<PageType>({}).lean();
    res.status(200).json({ success: true, pages });
  } catch (err) {
    res.status(500).json({
      success: false,
      errorMessage: 'Failed to get pages',
    });
  }
};

const createPage = async (req: Request, res: Response) => {
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
};

const deletePage = async (req: Request, res: Response) => {
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
};

const editPage = async (req: Request, res: Response) => {
  try {
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
};

export { getPages, createPage, deletePage, editPage };
