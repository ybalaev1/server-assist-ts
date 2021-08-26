import { userRoute } from './users/routes.config';
import { connectToDatabase } from './services/mongoose.service';
import { authRoute } from './services/auth/auth.config';
import { newsRoute } from './news/routes.config';

const express = require('express');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', userRoute());
app.use('/', authRoute());
app.use('/', newsRoute());

app.listen((process.env.PORT || 5000), async () => {
  await connectToDatabase();

  // eslint-disable-next-line no-console
  console.log(`Application started on URL ${5000} 🎉`);
});
