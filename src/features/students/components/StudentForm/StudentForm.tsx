import { type FC } from 'react';

import { Form, Modal } from 'antd';

import StudentFormFields from '@/features/students/components/StudentForm/StudentFormFields';
import { useStudentForm } from '@/features/students/components/StudentForm/useStudentForm';
import type { StudentFormProps } from '@/features/students/types/studentTypes';
import AvatarUploader from '@/shared/components/UI/AvatarUploader';

const StudentForm: FC<StudentFormProps> = (props) => {
  const { form, handleOk, handleCancel, fileList, setFileList } =
    useStudentForm(props);

  return (
    <Modal
      title={props.editedStudent ? 'Update student' : 'New student'}
      open={props.isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={props.editedStudent ? 'Update' : 'Create'}
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
