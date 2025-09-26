import { type FC } from 'react';

import { Form, Modal } from 'antd';

import type { StudentFormProps } from '@/features/students/studentTypes';
import { useStudentForm } from '@/features/students/useStudentForm';

import AvatarUploader from './AvatarUploader';
import StudentFormFields from './StudentFormFields';

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
