import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { ConfigProvider, theme as antdTheme } from 'antd';
import { PersistGate } from 'redux-persist/integration/react';

import App from '@/app/App.tsx';
import { persistor, store } from '@/store/index.tsx';

import '@/shared/styles/main.scss';

import '@/app/firebase.ts';

const Root = () => {
  // const [isDark, setIsDark] = useState(false);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ConfigProvider
          theme={{
            algorithm: antdTheme.defaultAlgorithm,
            cssVar: true,
          }}
        >
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ConfigProvider>
      </PersistGate>
    </Provider>
  );
};

createRoot(document.getElementById('root')!).render(<Root />);
