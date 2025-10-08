import { Modal } from 'antd';

import GroupForm from '@/features/groups/components/GroupForm/GroupForm';
import StudentForm from '@/features/students/components/StudentForm/StudentForm';
// import LessonFormModal from '@/features/lessons/components/LessonFormModal/LessonFormModal';
import { useModal } from '@/shared/providers/ModalProvider';

export const AppModal = () => {
  const { modal, closeModal } = useModal();
  const { type, mode, entityId, open, extra } = modal;

  const getContent = () => {
    switch (type) {
      //   case 'lesson':
      //     return (
      //       <LessonFormModal
      //         mode={mode}
      //         lessonId={entityId}
      //         extra={extra}
      //         onClose={closeModal}
      //       />
      //     );
      case 'group':
        return (
          <GroupForm mode={mode} groupId={entityId} onClose={closeModal} />
        );
      case 'student':
        return (
          <StudentForm mode={mode} studentId={entityId} onClose={closeModal} />
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
