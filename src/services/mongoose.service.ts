import mongoose, { ConnectionOptions } from 'mongoose';

mongoose.Promise = global.Promise;

const connectToDatabase = async (port: number): Promise<void> => {
  const options: ConnectionOptions = {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  };
  if (port === 3000) {
    await mongoose.connect('mongodb+srv://y_balaev:thomson567@cluster0.3ygft.mongodb.net/testDB?retryWrites=true&w=majority', options);
  } else {
    await mongoose.connect('mongodb+srv://y_balaev:thomson567@cluster0.3ygft.mongodb.net/assistDB?retryWrites=true&w=majority', options);
  }
};

export { connectToDatabase };
