import cors from 'cors';

export const corsHandler = cors({
  origin: [
    'http://localhost:5173',
    //TODO 'https://твій-прод-домен'  // додай коли деплоїш
  ],
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204,
});
