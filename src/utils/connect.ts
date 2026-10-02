import mongoose from 'mongoose';
import logger from './logger';

function connectDb() {
  return mongoose
    .connect(process.env.MONGO_URI!)
    .then(async () => {
      logger.info('Connected to MongoDB');
      try {
        const collection = mongoose.connection.collection('users');
        const indexes = await collection.indexes();
        const hasUsernameIndex = indexes.some((idx) => idx.name === 'username_1');
        if (hasUsernameIndex) {
          await collection.dropIndex('username_1');
          logger.info('Dropped obsolete index username_1 from users collection');
        }
      } catch (e: any) {
        logger.warn(`Index check notice: ${e?.message || e}`);
      }
    })
    .catch((err) => logger.error(err));
}

export default connectDb;