import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      'mongodb+srv://irfan:irfan@cluster0.nuwei.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log(`🧾 Database Connected ...`.cyan.underline);
  } catch (error) {
    console.log(`Error in mongodb connection - ${error}`.red.bold);
    process.exit(1);
  }
};

export default connectDB;
