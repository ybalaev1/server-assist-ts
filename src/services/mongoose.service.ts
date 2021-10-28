import mongoose, { ConnectionOptions } from 'mongoose';

mongoose.Promise = global.Promise;

const connectToDatabase = async (port: number): Promise<void> => {
  const options: ConnectionOptions = {
    useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true, useUnifiedTopology: true,
  };
  if (port === 3000) {
    await mongoose.connect(`mongodb+srv://${process.env.db_user}:${process.env.db_pass}@cluster0.3ygft.mongodb.net/${process.env.db_env}DB?retryWrites=true&w=majority`, options);
  } else {
    await mongoose.connect(`mongodb+srv://${process.env.db_user}:${process.env.db_pass}@cluster0.3ygft.mongodb.net/${process.env.db_env}DB?retryWrites=true&w=majority`, options);
  }
};

export { connectToDatabase };
