import { useEffect, useState } from 'react';

import { Form } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import dayjs from 'dayjs';
import { Timestamp } from 'firebase/firestore';

import { useGetStudentsQuery } from '@/features/students/api/studentsApi';
import { useStudentActions } from '@/features/students/hooks/useStudentActions';
import type {
  StudentData,
  StudentFormProps,
  StudentFormValues,
} from '@/features/students/types/studentTypes';
import { useErrorHandler } from '@/shared/hooks/useErrorHandler';
import { uploadAvatar } from '@/shared/utils/uploadAvatar';

export const useStudentForm = ({
  isModalOpen,
  onClose,
  editedStudentId,
}: StudentFormProps) => {
  const [form] = Form.useForm<StudentFormValues>();
  const { data: students } = useGetStudentsQuery();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const { createStudent, updateStudentData } = useStudentActions();
  const { handleError } = useErrorHandler();
  const [isLoading, setIsLoading] = useState(false);
  const editedStudent = students?.find((s) => s.id === editedStudentId);

  useEffect(() => {
    if (isModalOpen && editedStudent) {
      form.setFieldsValue({
        ...editedStudent,
        birthdate: editedStudent.birthdate
          ? dayjs(editedStudent.birthdate)
          : null,
      });
    } else {
      form.resetFields();
    }
  }, [isModalOpen, editedStudentId, students, editedStudent, form]);

  const handleCancel = () => {
    onClose();
    form.resetFields();
    setFileList([]);
  };

  const handleOk = async () => {
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

      handleCancel();
    } catch (err) {
      handleError(err, 'Student form error!');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    handleOk,
    handleCancel,
    fileList,
    setFileList,
    isLoading,
  };
};
