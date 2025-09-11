import { BrowserRouter } from 'react-router';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './main.scss';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
