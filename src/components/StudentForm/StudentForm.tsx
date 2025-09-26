import { type FC } from 'react';

import { Form, Modal } from 'antd';

import { useStudentForm } from '@/hooks/useStudentForm';
import type { Student } from '@/types/studentTypes';

import AvatarUploader from './AvatarUploader';
import StudentFormFields from './StudentFormFields';

interface StudentFormProps {
  isModalOpen: boolean;
  onClose: () => void;
  isEditMode: boolean;
  editedStudent?: Student | null;
}

const StudentForm: FC<StudentFormProps> = (props) => {
  const { form, handleOk, handleCancel, fileList, setFileList } =
    useStudentForm(props);

  return (
    <Modal
      title={props.isEditMode ? 'Update student' : 'New student'}
      open={props.isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={props.isEditMode ? 'Update' : 'Create'}
      cancelText="Cancel"
    >
      <Form form={form} layout="vertical" name="student_form">
        <StudentFormFields />
        <AvatarUploader fileList={fileList} setFileList={setFileList} />
      </Form>
    </Modal>
  );
};

export default StudentForm;
