import mongoose, { ConnectionOptions } from 'mongoose';
const dotenv = require('dotenv');

mongoose.Promise = global.Promise;

const connectToDatabase = async (): Promise<void> => {
  await dotenv.config();
  const options: ConnectionOptions = {
    useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true, useUnifiedTopology: true,
  };
    await mongoose.connect(`mongodb+srv://${process.env.db_user}:${process.env.db_pass}@cluster0.3ygft.mongodb.net/${process.env.db_env}DB?retryWrites=true&w=majority`, options);
};

export { connectToDatabase };
