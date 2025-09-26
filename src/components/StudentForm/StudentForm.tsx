import { type FC } from 'react';

import { Form, Modal } from 'antd';

import { useStudentForm } from '@/hooks/useStudentForm';
import type { StudentFormProps } from '@/types/studentTypes';

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
