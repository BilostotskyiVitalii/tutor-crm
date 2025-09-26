import { useEffect, useState } from 'react';

import { Form, notification } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import dayjs from 'dayjs';

import {
  useAddStudentMutation,
  useUpdateStudentMutation,
} from '@/store/studentsApi';
import type {
  Student,
  StudentData,
  StudentFormValues,
} from '@/types/studentTypes';
import { uploadAvatar } from '@/utils/uploadAvatar';

interface UseStudentFormProps {
  isModalOpen: boolean;
  onClose: () => void;
  isEditMode: boolean;
  editedStudent?: Student | null;
}

export const useStudentForm = ({
  isModalOpen,
  onClose,
  isEditMode,
  editedStudent,
}: UseStudentFormProps) => {
  const [form] = Form.useForm<StudentFormValues>();
  const [addStudent] = useAddStudentMutation();
  const [updateStudent] = useUpdateStudentMutation();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (isModalOpen) {
      if (isEditMode && editedStudent) {
        form.setFieldsValue({
          ...editedStudent,
          birthdate: editedStudent.birthdate
            ? dayjs(editedStudent.birthdate)
            : null,
        });
      } else {
        form.resetFields();
      }
    }
  }, [isModalOpen, isEditMode, editedStudent, form]);

  const handleCancel = () => {
    onClose();
    form.resetFields();
  };

  const handleOk = async () => {
    try {
      const values: StudentFormValues = await form.validateFields();
      const normalizeValues: StudentData = {
        ...values,
        phone: values.phone ?? '',
        contact: values.contact ?? '',
        birthdate: values.birthdate ? values.birthdate.valueOf() : '',
        notes: values.notes ?? '',
        status: isEditMode && editedStudent ? editedStudent.status : 'active',
      };

      if (fileList.length > 0) {
        const file = fileList[0].originFileObj as File;
        const studentId =
          isEditMode && editedStudent ? editedStudent.id : crypto.randomUUID();
        normalizeValues.avatarUrl = await uploadAvatar(
          file,
          studentId,
          editedStudent?.avatarUrl,
        );
      }

      if (isEditMode && editedStudent) {
        await updateStudent({
          id: editedStudent.id,
          data: normalizeValues,
        }).unwrap();
        notification.success({ message: 'Student updated!' });
      } else {
        await addStudent(normalizeValues).unwrap();
        notification.success({ message: 'Student created!' });
      }

      onClose();
      form.resetFields();
      setFileList([]);
    } catch {
      notification.error({ message: 'Student form error!' });
    }
  };

  return { form, handleOk, handleCancel, fileList, setFileList };
};
