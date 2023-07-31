import mongoose, { ConnectionOptions } from 'mongoose';
const dotenv = require('dotenv');

mongoose.Promise = global.Promise;

const connectToDatabase = async (): Promise<void> => {
  await dotenv.config();
  const options: ConnectionOptions = {
    useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true, useUnifiedTopology: true, connectTimeoutMS: 500000,
  };
    await mongoose.connect(`mongodb+srv://${process.env.db_user}:${process.env.db_pass}@cluster0.tozhfgs.mongodb.net/testingDB?retryWrites=true&w=majority`, options);
};

export { connectToDatabase };
