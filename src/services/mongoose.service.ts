import mongoose, { ConnectionOptions } from 'mongoose';
const dotenv = require('dotenv');

mongoose.Promise = global.Promise;

const dbHost = process.env.db_host || 'db'
const dbUser = process.env.db_user || 'y1balaev' ;
const dbPass = process.env.db_pass || 'rVsueR6Q4UYwG6pb' ;
const dbName = process.env.db_name || 'dance_connect' ;
const dbPort = process.env.db_port || 27017 ;


// Construct the Mongoose connection string
const connectionString = `mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?authMechanism=DEFAULT`;

const connectToDatabase = async (): Promise<void> => {
  await dotenv.config();
  const options: ConnectionOptions = {
    useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true, useUnifiedTopology: true, connectTimeoutMS: 500000,
  };
  await mongoose.connect(connectionString, options).then( function() {
    console.log('MongoDB is connected');
  })
    .catch( function(err) {
    console.log(err);
  });
    // await mongoose.connect(connectionString, options).then((conn) => console.log('connected', conn));
};

export { connectToDatabase };
