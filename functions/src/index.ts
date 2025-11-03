import cookieParser from 'cookie-parser';
import express, { json } from 'express';
import * as functions from 'firebase-functions/v1';

import { serializeDatesToISO } from './middleware/serializeDatesToISO';
import { authRouter } from './routes/authRouter';
import { dashboardRouter } from './routes/dashboardRouter';
import { groupsRouter } from './routes/groupsRouter';
import { lessonsRouter } from './routes/lessonsRouter';
import { studentsRouter } from './routes/studentsRouter';
import { uploadsRouter } from './routes/uploadsRouter';
import { corsHandler } from './utils/cors';

import './firebase';

const app = express();
app.set('trust proxy', true);
app.use(cookieParser());
app.use(corsHandler);
app.options(/.*/, corsHandler);
app.use(json());
app.use(
  serializeDatesToISO({
    keys: [
      'createdAt',
      'updatedAt',
      'start',
      'end',
      'birthdate',
      /Date$/i, // birthDate, eventDate
    ],
  }),
);

app.use('/auth', authRouter);
app.use('/groups', groupsRouter);
app.use('/students', studentsRouter);
app.use('/lessons', lessonsRouter);
app.use('/dashboard', dashboardRouter);
app.use('/uploads', uploadsRouter);

export const api = functions.region('us-central1').https.onRequest(app);
