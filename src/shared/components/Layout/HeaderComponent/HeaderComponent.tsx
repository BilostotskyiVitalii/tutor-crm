import { type FC } from 'react';

import { MenuOutlined } from '@ant-design/icons';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Layout, Space } from 'antd';

import UserMenu from '@/features/user/components/UserMenu/UserMenu';
import LogoComponent from '@/shared/components/Layout/LogoComponent/LogoComponent';
import SelectLang from '@/shared/components/UI/SelectLang/SelectLang';
import { useModal } from '@/shared/providers/ModalProvider';

import styles from './HeaderComponent.module.scss';

const { Header } = Layout;

type HeaderProps = {
  onBurgerClick?: () => void;
  isMobile?: boolean;
};

const HeaderComponent: FC<HeaderProps> = ({ onBurgerClick, isMobile }) => {
  const { openModal } = useModal();

  function onAddLesson() {
    openModal({
      type: 'lesson',
      mode: 'create',
    });
  }

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
        <Button type="primary" icon={<PlusOutlined />} onClick={onAddLesson}>
          New lesson
        </Button>
        <SelectLang />
        {/* добавь здесь кнопку смены темы и реализуй */}
        <UserMenu />
      </Space>
    </Header>
  );
};

export default HeaderComponent;
