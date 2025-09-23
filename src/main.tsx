import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { PersistGate } from 'redux-persist/integration/react';

import { persistor, store } from '@/store/index.tsx';

import App from './App.tsx';

import './main.scss';

import './firebase';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>,
);
