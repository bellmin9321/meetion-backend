import mongoose from 'mongoose';
import config from '../config/dotenv';

const mongooseLoader = async () => {
  try {
    await mongoose.connect(config.MONGO_URI as string);

    const db = mongoose.connection;

    db.on('error', () => {
      console.log('Connection failed');
    });

    db.once('open', () => {
      console.log('Connected');
    });
  } catch (err) {
    console.log(err);
  }
};

export default mongooseLoader;
