import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import { Spin } from 'antd';
import { PersistGate } from 'redux-persist/integration/react';

import { AppWrapper } from '@/shared/providers/AppWrapper';
import { persistor, store } from '@/store/index.tsx';

import '@/shared/styles/main.scss';

import '@/app/firebase.ts';

const Root = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<Spin fullscreen />} persistor={persistor}>
        <AppWrapper />
      </PersistGate>
    </Provider>
  );
};

createRoot(document.getElementById('root')!).render(<Root />);
