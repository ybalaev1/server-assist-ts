import mongoose, { ConnectionOptions } from 'mongoose';
const dotenv = require('dotenv');

mongoose.Promise = global.Promise;

const dbHost = process.env.db_host || 'localhost:27017'
const dbUser = process.env.db_user || 'y1balaev' ;
const dbPass = process.env.db_pass || 'rVsueR6Q4UYwG6pb' ;


// Construct the Mongoose connection string
const connectionString = `mongodb://${dbUser}:${dbPass}@${dbHost}/?authMechanism=DEFAULT`;

const connectToDatabase = async (): Promise<void> => {
  await dotenv.config();
  const options: ConnectionOptions = {
    useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true, useUnifiedTopology: true, connectTimeoutMS: 500000,
  };
    await mongoose.connect(connectionString, options);
};

export { connectToDatabase };
