import { noticeRoute } from './notice/routes.config';
import { userRoute } from './users/routes.config';
import { connectToDatabase } from './services/mongoose.service';
import { authRoute } from './services/auth/auth.config';
import { newsRoute } from './news/routes.config';
import { chatsRoute } from './chats/routes.config';
import * as socketMiddleware from './services/socket/middleware/socket.middleware';
import { communitiesRoute } from './communities/routes.config';

const cors = require('cors');

const express = require('express');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', userRoute());
app.use('/', authRoute());
app.use('/', communitiesRoute());
// app.use('/', newsRoute());
// app.use('/', noticeRoute());
// app.use('/', chatsRoute());

const PORT = process.env.PORT || 3000;
app.use(
  cors({
        // origin: `http://localhost:${PORT}`,
    origin: `https://dance-connect-528e8b559e89.herokuapp.com:${PORT}`,
    optionsSuccessStatus: 200,
    credentials: true,
  }),
);
const server = app.listen(PORT, async () => {
  await connectToDatabase();
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${PORT}.`);
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
