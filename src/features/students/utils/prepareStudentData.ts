import type { UploadFile } from 'antd';
import { serverTimestamp, Timestamp } from 'firebase/firestore';

import type {
  Student,
  StudentData,
  StudentFormValues,
} from '@/features/students/types/studentTypes';
import { uploadAvatar } from '@/shared/utils/uploadAvatar';

export const prepareStudentData = async (
  formValues: StudentFormValues,
  fileList: UploadFile[],
  editedStudent?: Student | null,
): Promise<StudentData> => {
  const studentId = editedStudent ? editedStudent.id : crypto.randomUUID();

  const normalized: StudentData = {
    ...formValues,
    birthdate: formValues.birthdate
      ? Timestamp.fromMillis(formValues.birthdate.valueOf())
      : null,
    isActive: editedStudent?.isActive ?? true,
    phone: formValues.phone || null,
    contact: formValues.contact || null,
    notes: formValues.notes || null,
    ...(editedStudent ? {} : { createdAt: serverTimestamp() }),
    updatedAt: serverTimestamp(),
  };

  if (fileList.length > 0) {
    const file = fileList[0].originFileObj as File;
    normalized.avatarUrl = await uploadAvatar(
      file,
      studentId,
      editedStudent?.avatarUrl,
    );
  }

  return normalized;
};
