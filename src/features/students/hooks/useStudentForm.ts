import { useEffect, useState } from 'react';

import { Form, type UploadFile } from 'antd';
import dayjs from 'dayjs';
import { Timestamp } from 'firebase/firestore';

import { useGetStudentByIdQuery } from '@/features/students/api/studentsApi';
import { useStudentActions } from '@/features/students/hooks/useStudentActions';
import type {
  StudentData,
  StudentFormValues,
} from '@/features/students/types/studentTypes';
import { prepareStudentData } from '@/features/students/utils/prepareStudentData';
import { useErrorHandler } from '@/shared/hooks/useErrorHandler';
import { uploadAvatar } from '@/shared/utils/uploadAvatar';

type useStudentFormProps = {
  studentId?: string | null;
  onClose: () => void;
  fileList: UploadFile[];
  setFileList: (fileList: UploadFile[] | []) => void;
};

export const useStudentForm = ({
  studentId,
  onClose,
  fileList,
  setFileList,
}: useStudentFormProps) => {
  const [form] = Form.useForm<StudentFormValues>();
  const { data: editedStudent } = useGetStudentByIdQuery(studentId ?? '');
  const { createStudent, updateStudentData } = useStudentActions();
  const { handleError } = useErrorHandler();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editedStudent) {
      form.setFieldsValue({
        ...editedStudent,
        birthdate: editedStudent.birthdate
          ? dayjs(editedStudent.birthdate)
          : null,
      });
    }
  }, [editedStudent, form]);

  const onFinish = async () => {
    try {
      setIsLoading(true);

      const formValues: StudentFormValues = await form.validateFields();
      const normalized = await prepareStudentData(
        formValues,
        fileList,
        editedStudent,
      );

      if (editedStudent) {
        await updateStudentData(editedStudent.id, normalized);
      } else {
        await createStudent(normalized);
      }

      onClose();
      setFileList([]);
    } catch (err) {
      handleError(err, 'Student form error!');
    } finally {
      setIsLoading(false);
    }
  };
  return {
    form,
    onFinish,
    isLoading,
  };
};
