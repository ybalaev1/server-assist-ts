import mongoose, { ConnectionOptions } from 'mongoose';
const dotenv = require('dotenv');

mongoose.Promise = global.Promise;

const dbHost = process.env.MONGODB_URI || 'mongo_db'
const dbUser = process.env.db_user || 'y1balaev' ;
const dbPass = process.env.db_pass || 'rVsueR6Q4UYwG6pb' ;


// Construct the Mongoose connection string
const connectionString = `mongodb://${dbUser}:${dbPass}@${dbHost}/?authMechanism=DEFAULT`;

const connectToDatabase = async (): Promise<void> => {
  await dotenv.config();
  const options: ConnectionOptions = {
    useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true, useUnifiedTopology: true, connectTimeoutMS: 500000,
  };
  console.log('mongoose connected: ', process.env.MONGO_URI, 'MONGODB_URI', process.env.MONGODB_URI)
    await mongoose.connect(connectionString, options).then(() => console.log('mongoose connected: ', process.env.MONGO_URI, 'MONGODB_URI', process.env.MONGODB_URI));
};

export { connectToDatabase };
