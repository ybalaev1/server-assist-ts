import { userRoute } from './users/routes.config';
import { connectToDatabase } from './services/mongoose.service';
import { authRoute } from './services/auth/auth.config';
import { newsRoute } from './news/routes.config';
import { chatsRoute } from './chats/routes.config';
import { createMessage, lattestMessage } from './chats/controllers/chats.controller';

const cors = require('cors');
const port = 8463;
const express = require('express');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', userRoute());
app.use('/', authRoute());
app.use('/', newsRoute());
app.use('/', chatsRoute());
app.use(cors({
  origin: 'https://assistapp.club:3000',
  optionsSuccessStatus: 200,
  credentials: true,
}));
const server = app.listen(port, () => console.log(`Server running on port ${port}`));
const socket = require('socket.io')(server);

app.listen((process.env.PORT || 3000), async () => {
  // await connectToDatabase(process.env.PORT || 3000); prod = process.env.PORT ; dev = 3000
  await connectToDatabase(3000);

  socket.on('connection', async (client) => {
    console.log('client connected...', client);

    client.on('message', async (msg: any) => {
      const message = await createMessage(msg);
      socket.emit('message', message);
    });
    client.on('chat_id', async (id: string) => {
      const last = await lattestMessage(id);
      socket.emit('latest', last);
    });
    // client.on('latest', async () => {
    //   const latest = await lattestMesage(10);
    //   socket.emit('latest', latest);
    // });
    // client.on('user writing', async () => {
    //   socket.emit('typping');
    // });
  });
  socket.on('disconnected', async (client) => {
    client.emit('broadcast', '[Server]: Bye, bye!');
  });
  // eslint-disable-next-line no-console
  console.log(`Application started on URL ${3000} 🎉`);
});
