import cors from 'cors';

export const corsHandler = cors({
  origin: ['http://localhost:5173'],
  credentials: true,
});
