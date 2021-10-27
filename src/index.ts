import { noticeRoute } from './notice/routes.config';
import { userRoute } from './users/routes.config';
import { connectToDatabase } from './services/mongoose.service';
import { authRoute } from './services/auth/auth.config';
import { newsRoute } from './news/routes.config';
import { chatsRoute } from './chats/routes.config';
import * as socketMiddleware from './services/socket/middleware/socket.middleware';

const cors = require('cors');
const dotenv = require('dotenv');

const express = require('express');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', userRoute());
app.use('/', authRoute());
app.use('/', newsRoute());
app.use('/', noticeRoute());
app.use('/', chatsRoute());
app.use(
  cors({
    //     origin: 'http://localhost:3000',
    origin: 'https://assistapp.club:4200',
    optionsSuccessStatus: 200,
    credentials: true,
  }),
);
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, async () => {
  dotenv.config();
  await connectToDatabase(3000);
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${4200}.`);
});

const io = require('socket.io')(server);

io.on('connection', (socket) => {
  socketMiddleware.userInitCocket(socket);
  socketMiddleware.messagingSocket(socket, 'message', io);
  socketMiddleware.latestMessageSocket(socket);
  socketMiddleware.typpingUserSocket(socket, io);
  //   socket.on('online', async (id: string) => {
  //     socket.emit('online', id);
  //   });

  socket.on('notyping', async () => {
    io.emit('typing', '');
  });
});
