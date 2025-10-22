import express, { json } from 'express';
import * as functions from 'firebase-functions/v1';

import { serializeDatesToISO } from './middleware/serializeDatesToISO';
import { dashboardRouter } from './routes/dashboard.router';
import { groupsRouter } from './routes/groups.router';
import { lessonsRouter } from './routes/lessons.router';
import { studentsRouter } from './routes/students.router';
import { corsHandler } from './utils/cors';

import './firebase';

const app = express();
app.set('trust proxy', true);
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
app.use('/groups', groupsRouter);
app.use('/students', studentsRouter);
app.use('/lessons', lessonsRouter);
app.use('/dashboard', dashboardRouter);

export const api = functions.region('us-central1').https.onRequest(app);
