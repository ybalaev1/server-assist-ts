import mongoose, { ConnectionOptions } from 'mongoose';
const dotenv = require('dotenv');

mongoose.Promise = global.Promise;

const dbHost = process.env.db_host || 'mongo_db'
const dbUser = process.env.db_user || 'y1balaev' ;
const dbPass = process.env.db_pass || 'rVsueR6Q4UYwG6pb' ;
const dbName = process.env.db_name || 'dc' ;


// Construct the Mongoose connection string
const connectionString = `mongodb://${dbUser}:${dbPass}@${dbHost}/dc?authSource=admin`;

const connectToDatabase = async (): Promise<void> => {
  await dotenv.config();
  const options: ConnectionOptions = {
    useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true, useUnifiedTopology: true, connectTimeoutMS: 500000,
  };
  await mongoose.connect(connectionString, options).then( function() {
    console.log('MongoDB is connected', connectionString);
  })
    .catch( function(err) {
    console.log('connected err', err);
  });
    // await mongoose.connect(connectionString, options).then((conn) => console.log('connected', conn));
};

export { connectToDatabase };
