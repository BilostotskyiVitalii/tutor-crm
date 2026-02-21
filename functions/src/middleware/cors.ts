import cors from 'cors';

import { FRONTEND_ORIGIN } from '../config';

export const corsHandler = cors({
  origin: ['http://localhost:5173', FRONTEND_ORIGIN.value()],
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204,
});
