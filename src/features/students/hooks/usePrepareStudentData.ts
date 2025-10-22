import { useCallback } from 'react';

import type { UploadFile } from 'antd';

import type {
  Student,
  StudentData,
  StudentFormValues,
} from '@/features/students/types/studentTypes';
import { useUploadAvatar } from '@/shared/hooks/useUploadAvatar';
import { normalizeData } from '@/shared/utils/normalizeData';

export const usePrepareStudentData = () => {
  const { uploadAvatar } = useUploadAvatar();

  const prepareStudentData = useCallback(
    async (
      formValues: StudentFormValues,
      fileList: UploadFile[],
      editedStudent?: Student | null,
    ): Promise<StudentData> => {
      const studentId = editedStudent ? editedStudent.id : crypto.randomUUID();

      const normalized = normalizeData({
        ...formValues,
        isActive: editedStudent?.isActive || true,
        birthdate: formValues.birthdate
          ? formValues.birthdate.toDate().getTime()
          : null,
      });

      if (fileList.length > 0) {
        const file = fileList[0].originFileObj as File;
        normalized.avatarUrl = await uploadAvatar(
          file,
          studentId,
          editedStudent?.avatarUrl,
        );
      } else if (fileList.length === 0) {
        normalized.avatarUrl = editedStudent?.avatarUrl;
      }

      return normalized;
    },
    [uploadAvatar],
  );

  return { prepareStudentData };
};
