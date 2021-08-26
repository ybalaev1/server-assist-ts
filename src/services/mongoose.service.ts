import mongoose, { ConnectionOptions } from 'mongoose';

mongoose.Promise = global.Promise;

const connectToDatabase = async (): Promise<void> => {
  const options: ConnectionOptions = {
    useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true, useUnifiedTopology: true,
  };

  await mongoose.connect('mongodb+srv://y_balaev:thomson567@cluster0.3ygft.mongodb.net/assistDB?retryWrites=true&w=majority', options);
};

export { connectToDatabase };
