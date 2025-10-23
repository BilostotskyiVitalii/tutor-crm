import { useCallback, useEffect, useState } from 'react';

import { Form, type UploadFile } from 'antd';
import dayjs from 'dayjs';

import { useGetStudentByIdQuery } from '@/features/students/api/studentsApi';
import { useStudentActions } from '@/features/students/hooks/useStudentActions';
import type { StudentFormValues } from '@/features/students/types/studentTypes';
import { useErrorHandler } from '@/shared/hooks/useErrorHandler';
import { useUploadAvatar } from '@/shared/hooks/useUploadAvatar';
import { getChangedFields } from '@/shared/utils/getChangedFields';
import { toNullData } from '@/shared/utils/toNullData';

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
  // TODO pass student, not id
  const { data: editedStudent } = useGetStudentByIdQuery(studentId!, {
    skip: !studentId,
  });
  const { createStudent, updateStudentData } = useStudentActions();
  const { handleError } = useErrorHandler();
  const [isLoading, setIsLoading] = useState(false);
  const { uploadAvatar } = useUploadAvatar();

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

  const prepareStudentData = useCallback(async () => {
    const values = await form.validateFields();
    const normalized = toNullData({
      ...values,
      birthdate: values.birthdate ? values.birthdate.toDate().getTime() : null,
    });

    if (fileList.length > 0) {
      const file = fileList[0].originFileObj as File;
      normalized.avatarUrl = await uploadAvatar(
        file,
        editedStudent ? editedStudent.id : crypto.randomUUID(),
        editedStudent?.avatarUrl,
      );
    } else {
      normalized.avatarUrl = editedStudent?.avatarUrl || null;
    }

    return normalized;
  }, [form, fileList, editedStudent, uploadAvatar]);

  const onFinish = async () => {
    try {
      setIsLoading(true);

      const normalized = await prepareStudentData();

      if (editedStudent) {
        const changedFields = getChangedFields(normalized, editedStudent);

        if (Object.keys(changedFields).length > 0) {
          await updateStudentData(editedStudent.id, changedFields);
        }
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
