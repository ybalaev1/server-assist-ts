import { userRoute } from './users/routes.config';
import { connectToDatabase } from './services/mongoose.service';
import { authRoute } from './services/auth/auth.config';
import * as socketMiddleware from './services/socket/middleware/socket.middleware';
import { communitiesRoute } from './communities/routes.config';
import { eventsRoute } from './events/routes.config';
import { constansRoute } from './services/constans/constants.config';
import { Socket } from 'socket.io';

import cors from 'cors';

import express from 'express';

const stripeKey = 'sk_test_51NVTpaEh2JOoqoGgfr2g2dUR9PNWbFVtENMBkCZ2NCLwhPVNt96Qg7ajdI7YCe92RK3mhIKYTrCtjlRsbiye5bMm00WKN05uGh'
// const stripeKey = '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'
const app = express();
export const stripe = require('stripe')(stripeKey);
import redis, {createClient} from 'redis';
import { Event } from './events/model/event.model';
import { Community } from './communities/model/community.model';
// export const redisClient = redis.createClient();

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true, parameterLimit: 500 }));
app.use(express.json());

app.use('/', userRoute());
app.use('/', authRoute());
app.use('/', communitiesRoute());
app.use('/', eventsRoute());
app.use('/', constansRoute());

const PORT = process.env.PORT || 3000;
export const redisClient = createClient({
  // legacyMode: true,
  socket: {
    port: 6379,
    host: 'cache',
    // password: 'eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81',
  }
});
app.use(
  cors({
        // origin: `http://localhost:${PORT}`,
    origin: '*',
    // // origin: `https://dance-connect-528e8b559e89.herokuapp.com:${PORT}`,
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'],
    optionsSuccessStatus: 200,
    credentials: true,
    // maxAge: 3600000,
  }),
);
// (async () => {

//   redisClient.on("error", (error) => console.log('Что-то пошло не так', error));

//   await redisClient.connect();
// })();

const server = app.listen(PORT, async () => {
// app.listen(PORT, async () => {
  await connectToDatabase();
  // redisClient.on("error", (error) => console.log('Что-то пошло не так', error));
  // await redisClient.connect();
  // redisClient.auth({ password: 'eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81'});
  redisClient.on("error", (error) => console.log('Что-то пошло не так', error));
  redisClient.on('connect', async () => {
    console.log('redis connected');
    Event.find({}).exec(async (err, data) => {
      // console.log('events data', data);
      if (data?.length) {
        await redisClient.set('events', JSON.stringify(data));
      }
    });
  });
  Community.find({}).exec(async (err, data) => {
    // console.log('events data', data);
    if (data?.length) {
      await redisClient.set('communities', JSON.stringify(data));
    }
  });
  await redisClient.connect();
  console.log(`Server running on port ${PORT}.`);
});
server.setTimeout(50000);

export const io = require('socket.io')(server);
io.on('connection', (socket: Socket) => {
  console.log('a user connected', socket.id);
  socketMiddleware.subscribeCommunitySocket(socket, io);
  socketMiddleware.subscribeEventSocket(socket, io);
  // socketMiddleware.subscribedToUpdateEvents(socket, io);
  // socketMiddleware.updateCommunitySocket(socket, io);
  // socket.on('init', (id: string) => {
  //   console.log('init id', id);
  // });
});

// io.on('connection', (socket) => {
//   socketMiddleware.userInitCocket(socket);
  // socketMiddleware.messagingSocket(socket, 'message', io);
//   // socketMiddleware.latestMessageSocket(socket);
//   // socketMiddleware.typpingUserSocket(socket, io);
//   //   socket.on('online', async (id: string) => {
//   //     socket.emit('online', id);
//   //   });

//   console.log('a user connected');
//   socket.on('init', async (id: string) => {
//     console.log('userInitCocket init', id);
//     io.emit('connected', id);
//   });
// });
