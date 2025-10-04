import { type FC, useState } from 'react';

import { MenuOutlined } from '@ant-design/icons';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Layout, Space } from 'antd';

import LessonFormModal from '@/features/lessons/components/LessonFormModal/LessonFormModal';
import type { ModalState } from '@/features/lessons/types/lessonTypes';
import UserMenu from '@/features/user/components/UserMenu/UserMenu';
import LogoComponent from '@/shared/components/Layout/LogoComponent/LogoComponent';
import SelectLang from '@/shared/components/UI/SelectLang/SelectLang';

import styles from './HeaderComponent.module.scss';

const { Header } = Layout;

type HeaderProps = {
  onBurgerClick?: () => void;
  isMobile?: boolean;
};

const HeaderComponent: FC<HeaderProps> = ({ onBurgerClick, isMobile }) => {
  const [modalState, setModalState] = useState<ModalState>(null);
  const closeModal = () => setModalState(null);
  const openLessonModal = (lessonId: string | null = null) => {
    setModalState({ type: 'lesson', lessonId });
  };

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
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => openLessonModal()}
        >
          New lesson
        </Button>
        <SelectLang />
        <UserMenu />
      </Space>
      {modalState?.type === 'lesson' && (
        <LessonFormModal
          isModalOpen
          onClose={closeModal}
          editedLessonId={modalState?.lessonId}
        />
      )}
    </Header>
  );
};

export default HeaderComponent;
