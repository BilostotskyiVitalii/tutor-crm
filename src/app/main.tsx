import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import { AppWrapper } from '@/app/AppWrapper';
import { store } from '@/store/index.tsx';

import '@/shared/styles/main.scss';

import '@/app/firebase.ts';

const Root = () => {
  return (
    <Provider store={store}>
      <AppWrapper />
    </Provider>
  );
};

createRoot(document.getElementById('root')!).render(<Root />);
