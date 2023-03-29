import { Request, Response } from 'express';
import Page from '../../../models/Page';
import { PageType } from '../../../types';

const getPages = async (req: Request, res: Response) => {
  try {
    const { email } = req.query;

    const pages = await Page.find<PageType>({ creator: email }).lean();

    res.status(200).json({ success: true, pages });
  } catch (err) {
    res.status(500).json({
      success: false,
      errorMessage: 'Failed to get pages',
    });
  }
};

const getSharedPages = async (req: Request, res: Response) => {
  try {
    const { email } = req.query;

    const sharedPages = await Page.find<PageType>({
      sharedUsers: email,
    }).lean();

    res.status(200).json({ success: true, sharedPages });
  } catch (err) {
    res.status(500).json({
      success: false,
      errorMessage: 'Failed to get sharedPages',
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
    await Page.deleteOne({ _id: { $in: id } }).lean();

    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({
      success: false,
      errorMessage: 'Failed to delete page',
    });
  }
};

const editPage = async (req: Request, res: Response) => {
  try {
    const { title, desc, _id } = req.body;
    await Page.findOneAndUpdate(
      { _id: { $in: _id } },
      { $set: { title, desc } },
    ).lean();

    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({
      success: false,
      errorMessage: 'Failed to create page',
    });
  }
};

const addSharedEmail = async (req: Request, res: Response) => {
  try {
    const { _id, email } = req.body;
    const { sharedUsers } = await Page.findOne<PageType>({
      _id,
    }).lean();

    if (sharedUsers.includes(email)) {
      return res.status(500).json({
        success: false,
        errorMessage: 'The same email exists',
      });
    }

    const data = await Page.findOneAndUpdate(
      { _id: { $in: _id } },
      { $push: { sharedUsers: email } },
    ).lean();

    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({
      success: false,
      errorMessage: 'Failed to create page',
    });
  }
};

export {
  getPages,
  getSharedPages,
  createPage,
  deletePage,
  editPage,
  addSharedEmail,
};
