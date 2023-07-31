import { userRoute } from './users/routes.config';
import { connectToDatabase } from './services/mongoose.service';
import { authRoute } from './services/auth/auth.config';
// import * as socketMiddleware from './services/socket/middleware/socket.middleware';
import { communitiesRoute } from './communities/routes.config';
import { eventsRoute } from './events/routes.config';
import { constansRoute } from './services/constans/constants.config';

const cors = require('cors');

const express = require('express');

const app = express();

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true, parameterLimit: 500 }));
app.use(express.json());

app.use('/', userRoute());
app.use('/', authRoute());
app.use('/', communitiesRoute());
app.use('/', eventsRoute());
app.use('/', constansRoute());

const PORT = process.env.PORT || 3000;
app.use(
  cors({
        // origin: `http://localhost:${PORT}`,
    origin: `https://dance-connect-528e8b559e89.herokuapp.com:${PORT}`,
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'],
    optionsSuccessStatus: 200,
    credentials: true,
    // maxAge: 3600000,
  }),
);
  const server = app.listen(PORT, async () => {
// app.listen(PORT, async () => {
  await connectToDatabase();
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${PORT}.`);
});
server.setTimeout(50000);

// const io = require('socket.io')(server);

// io.on('connection', (socket) => {
//   socketMiddleware.userInitCocket(socket);
//   socketMiddleware.messagingSocket(socket, 'message', io);
//   socketMiddleware.latestMessageSocket(socket);
//   socketMiddleware.typpingUserSocket(socket, io);
//   //   socket.on('online', async (id: string) => {
//   //     socket.emit('online', id);
//   //   });

//   socket.on('notyping', async () => {
//     io.emit('typing', '');
//   });
// });
