import { Router } from 'express';
import {
  findById, insertEvent, getAllEvents, updateEvent, deleteEvent, getEventById, subscribeEvent, unSubscribeEvent, getManagingEvents, paidEvent, refundPaymentEvent,
  getUserImagesFromEvent,
} from './controllers/events.controller';
import { validJWTNeeded } from '../services/auth/controllers/auth.user';

const eventsRoute = () => {
  const app = Router();

  app.post('/events/', [validJWTNeeded, insertEvent]);
  app.post('/events/:id/update', [validJWTNeeded, updateEvent]);
  // app.post('/events/:id/subscribe', [validJWTNeeded, subscribeEvent]);
  app.post('/events/:id/unsubscribe', [validJWTNeeded, unSubscribeEvent]);
  app.get('/events/', [validJWTNeeded, getAllEvents]);
  app.get('/events/:id', [validJWTNeeded, getEventById]);
  app.get('/managing_events/', [validJWTNeeded, getManagingEvents]);
  app.delete('/events/:id', [validJWTNeeded, deleteEvent]);

  app.get('/event/:id/attended-people-images', [validJWTNeeded, getUserImagesFromEvent])

  app.post('/event/:id/create-payment-intent', [validJWTNeeded, paidEvent])
  app.post('/event/:id/refund-payment', [validJWTNeeded, refundPaymentEvent]);

  return app;
};

export { eventsRoute };
