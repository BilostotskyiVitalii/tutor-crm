import { useEffect, useState } from 'react';

import { Form, type UploadFile } from 'antd';
import dayjs from 'dayjs';
import { Timestamp } from 'firebase/firestore';

import { useGetStudentsQuery } from '@/features/students/api/studentsApi';
import { useStudentActions } from '@/features/students/hooks/useStudentActions';
import type {
  StudentData,
  StudentFormValues,
} from '@/features/students/types/studentTypes';
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
  const { data: students } = useGetStudentsQuery();
  const editedStudent = students?.find((s) => s.id === studentId);
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
  }, [students, editedStudent, form]);

  const onFinish = async () => {
    try {
      setIsLoading(true);

      const formValues: StudentFormValues = await form.validateFields();
      const normalizeValues: StudentData = {
        ...formValues,
        birthdate: formValues.birthdate
          ? Timestamp.fromMillis(formValues.birthdate.valueOf())
          : null,
        isActive: editedStudent?.isActive ?? true,
        phone: formValues.phone || null,
        contact: formValues.contact || null,
        notes: formValues.notes || null,
      };

      if (fileList.length > 0) {
        const file = fileList[0].originFileObj as File;
        normalizeValues.avatarUrl = await uploadAvatar(
          file,
          editedStudent ? editedStudent.id : crypto.randomUUID(),
          editedStudent?.avatarUrl,
        );
      }

      if (editedStudent) {
        await updateStudentData(editedStudent.id, normalizeValues);
      } else {
        await createStudent(normalizeValues);
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
