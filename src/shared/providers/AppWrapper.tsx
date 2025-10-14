import { BrowserRouter } from 'react-router-dom';

import { App as AntApp, ConfigProvider, theme as antdTheme } from 'antd';

import App from '@/app/App';
import { useAppSelector } from '@/store/reduxHooks';

export const AppWrapper = () => {
  const themeMode = useAppSelector((state) => state.theme.mode);

  return (
    <ConfigProvider
      theme={{
        algorithm:
          themeMode === 'light'
            ? antdTheme.defaultAlgorithm
            : antdTheme.darkAlgorithm,
        cssVar: true,
      }}
    >
      <BrowserRouter>
        <AntApp>
          <App />
        </AntApp>
      </BrowserRouter>
    </ConfigProvider>
  );
};
