import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Form, type UploadFile } from 'antd';
import dayjs from 'dayjs';

import { useStudentActions } from '@/features/students/hooks/useStudentActions';
import type {
  Student,
  StudentFormValues,
} from '@/features/students/types/studentTypes';
import { useErrorHandler } from '@/shared/hooks/useErrorHandler';
import { useUploadAvatar } from '@/shared/hooks/useUploadAvatar';
import { getChangedFields } from '@/shared/utils/getChangedFields';
import { toNullData } from '@/shared/utils/toNullData';

type useStudentFormProps = {
  student?: Student | null;
  onClose: () => void;
  fileList: UploadFile[];
  setFileList: (fileList: UploadFile[] | []) => void;
};

export const useStudentForm = ({
  student,
  onClose,
  fileList,
  setFileList,
}: useStudentFormProps) => {
  const [form] = Form.useForm<StudentFormValues>();
  const { createStudent, updateStudentData } = useStudentActions();
  const { handleError } = useErrorHandler();
  const [isLoading, setIsLoading] = useState(false);
  const { uploadAvatar } = useUploadAvatar();
  const { t } = useTranslation();

  useEffect(() => {
    if (student) {
      form.setFieldsValue({
        ...student,
        birthdate: student.birthdate ? dayjs(student.birthdate) : null,
      });
    }
  }, [student, form]);

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
        student ? student.id : crypto.randomUUID(),
        student?.avatarUrl,
      );
    } else {
      normalized.avatarUrl = student?.avatarUrl || null;
    }

    return normalized;
  }, [form, fileList, student, uploadAvatar]);

  const onFinish = async () => {
    try {
      setIsLoading(true);

      const normalized = await prepareStudentData();

      if (student) {
        const changedFields = getChangedFields(normalized, student);

        if (Object.keys(changedFields).length > 0) {
          await updateStudentData(student.id, changedFields);
        }
      } else {
        await createStudent(normalized);
      }

      onClose();
      setFileList([]);
    } catch (err) {
      handleError(err, `${t('form.studentFormError')}`);
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
