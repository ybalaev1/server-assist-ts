import mongoose, { ConnectionOptions } from 'mongoose';

mongoose.Promise = global.Promise;

const connectToDatabase = async (port?: number): Promise<void> => {
  const options: ConnectionOptions = {
    useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true, useUnifiedTopology: true,
  };
  await mongoose.connect(`mongodb+srv://y1balaev:rVsueR6Q4UYwG6pb@cluster0.tozhfgs.mongodb.net/testingDB?retryWrites=true&w=majority`, options);

  // if (port === 3000) {
  //   await mongoose.connect(`mongodb+srv://y1balaev:rVsueR6Q4UYwG6pb@cluster0.tozhfgs.mongodb.net/${process.env.db_env}DB?retryWrites=true&w=majority`, options);
  // } else {
  //   await mongoose.connect(`mongodb+srv://y1balaev:rVsueR6Q4UYwG6pb@cluster0.tozhfgs.mongodb.net/${process.env.db_env}DB?retryWrites=true&w=majority`, options);
  // }
};

export { connectToDatabase };
