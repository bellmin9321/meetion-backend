import express, { Request, Response } from 'express';
import User from '../../models/User';
const userRouter = express.Router();

userRouter.get('/', async (req: Request, res: Response) => {
  try {
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({
      success: false,
      errorMessage: 'Failed to create user',
    });
  }
});

userRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { email, image, name } = req.body;

    const result = await User.findOneAndUpdate({ email }, { upsert: true });

    if (!result) {
      await User.create({
        email,
        image,
        name,
      });
    }

    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({
      success: false,
      errorMessage: 'Failed to create user',
    });
  }
});

export default userRouter;
