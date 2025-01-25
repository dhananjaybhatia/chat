import mongoose from 'mongoose';

const databaseConnect = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in the environment variables.');
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('DB connected successfully');

  } catch (error) {
    console.error('DB connection failed:', error.message);
    process.exit(1);
  }
};

export default databaseConnect; 