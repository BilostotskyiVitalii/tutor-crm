import { type FC } from 'react';

import { MenuOutlined } from '@ant-design/icons';
import { MoonFilled, SunFilled } from '@ant-design/icons';
import { Button, Layout, Space, Switch } from 'antd';

import { toggleTheme } from '@/features/theme/themeSlice';
import { UserMenu } from '@/features/user/components/UserMenu/UserMenu';
import LogoComponent from '@/shared/components/Layout/LogoComponent/LogoComponent';
import SelectLang from '@/shared/components/UI/SelectLang/SelectLang';
import { useAppDispatch } from '@/store/reduxHooks';

import styles from './HeaderComponent.module.scss';

const { Header } = Layout;

type HeaderProps = {
  onBurgerClick?: () => void;
  isMobile?: boolean;
};

const HeaderComponent: FC<HeaderProps> = ({ onBurgerClick, isMobile }) => {
  const dispatch = useAppDispatch();

  return (
    <Header className={styles.header}>
      {isMobile && onBurgerClick && (
        <Button
          className={styles.burgerButton}
          type="text"
          icon={<MenuOutlined />}
          onClick={onBurgerClick}
        />
      )}
      <LogoComponent />
      <Space>
        <Switch
          checkedChildren={<SunFilled />}
          unCheckedChildren={<MoonFilled />}
          defaultChecked
          onChange={() => dispatch(toggleTheme())}
        />
        <SelectLang />
        <UserMenu />
      </Space>
    </Header>
  );
};

export default HeaderComponent;
