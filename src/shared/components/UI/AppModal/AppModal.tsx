import { Modal } from 'antd';

import GroupForm from '@/features/groups/components/GroupForm/GroupForm';
import LessonForm from '@/features/lessons/components/LessonForm/LessonForm';
import StudentForm from '@/features/students/components/StudentForm/StudentForm';
import { useModal } from '@/shared/providers/ModalProvider';

export const AppModal = () => {
  const { modal, closeModal } = useModal();
  const { type, mode, entity, open, initData } = modal;

  const getContent = () => {
    switch (type) {
      case 'lesson':
        return (
          <LessonForm
            mode={mode}
            lesson={entity}
            initData={initData}
            onClose={closeModal}
          />
        );
      case 'group':
        return <GroupForm mode={mode} group={entity} onClose={closeModal} />;
      case 'student':
        return (
          <StudentForm mode={mode} student={entity} onClose={closeModal} />
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      open={open}
      onCancel={closeModal}
      footer={null}
      destroyOnHidden
      title={mode === 'edit' ? `Edit ${type}` : `New ${type}`}
    >
      {getContent()}
    </Modal>
  );
};
