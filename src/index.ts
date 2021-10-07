// import * as http from 'http';
// import * as WebSocket from 'ws';
import { userRoute } from './users/routes.config';
import { connectToDatabase } from './services/mongoose.service';
import { authRoute } from './services/auth/auth.config';
import { newsRoute } from './news/routes.config';
import { chatsRoute } from './chats/routes.config';

const express = require('express');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', userRoute());
app.use('/', authRoute());
app.use('/', newsRoute());
app.use('/', chatsRoute());

// const server = http.createServer(app);
// const wws = new WebSocket.Server({ server });

// wws.on('connection', (ws: WebSocket) => {
//   ws.on('message', (message: string) => {
//     // log the received message and send it back to the client
//     console.log('received: %s', message);
//     ws.send(`Hello, you sent -> ${message}`);
//   });

//   // send immediatly a feedback to the incoming connection
//   ws.send('Hi there, I am a WebSocket server');
// });

app.listen((process.env.PORT || 3000), async () => {
  await connectToDatabase();

  // eslint-disable-next-line no-console
  console.log(`Application started on URL ${3000} 🎉`);

  // server.listen(process.env.PORT || 8999, () => {
  //   console.log(`Server started on port ${process.env.PORT} :) 8999`);
  // });
});
