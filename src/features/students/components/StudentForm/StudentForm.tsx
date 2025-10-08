import { type FC, useEffect, useState } from 'react';

import {
  Button,
  DatePicker,
  Flex,
  Form,
  Input,
  InputNumber,
  Select,
  type UploadFile,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { Timestamp } from 'firebase/firestore';

import { useGetStudentsQuery } from '@/features/students/api/studentsApi';
import { useStudentActions } from '@/features/students/hooks/useStudentActions';
import type {
  Student,
  StudentData,
} from '@/features/students/types/studentTypes';
import { studentFormRules } from '@/features/students/utils/validationFormFields';
import AvatarUploader from '@/shared/components/UI/AvatarUploader/AvatarUploader';
import CurrencySelect from '@/shared/components/UI/CurrencySelect/CurrencySelect';
import { langLevels } from '@/shared/constants/varaibles';
import { useErrorHandler } from '@/shared/hooks/useErrorHandler';
import { uploadAvatar } from '@/shared/utils/uploadAvatar';

interface StudentFormProps {
  mode?: string;
  onClose: () => void;
  studentId?: string | null;
}

interface StudentFormValues
  extends Omit<Student, 'id' | 'birthdate' | 'createdAt' | 'updatedAt'> {
  birthdate: Dayjs | null;
}

const StudentForm: FC<StudentFormProps> = ({ mode, onClose, studentId }) => {
  const { createStudent, updateStudentData } = useStudentActions();
  const [form] = Form.useForm<StudentFormValues>();
  const { data: students } = useGetStudentsQuery();
  const [isLoading, setIsLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const editedStudent = students?.find((s) => s.id === studentId);
  const { handleError } = useErrorHandler();

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

  return (
    <Form form={form} onFinish={onFinish} layout="vertical" name="student_form">
      <Form.Item name="name" label="Name:" rules={studentFormRules.name}>
        <Input placeholder="John Snow" />
      </Form.Item>

      <Form.Item name="email" label="Email:" rules={studentFormRules.email}>
        <Input placeholder="student@mail.com" />
      </Form.Item>

      <Form.Item name="phone" label="Phone:" rules={studentFormRules.phone}>
        <Input placeholder="+380667462269" />
      </Form.Item>

      <Form.Item name="contact" label="Contact:">
        <Input placeholder="Link to insta, telegram, etc..." />
      </Form.Item>

      <Form.Item name="birthdate" label="Birthdate:">
        <DatePicker format="DD.MM.YYYY" placeholder="DD.MM.YYYY" />
      </Form.Item>

      <Flex justify="space-between" gap={24}>
        <Form.Item
          name="currentLevel"
          label="Current level:"
          style={{ flex: 1 }}
          rules={studentFormRules.level}
        >
          <Select options={langLevels} />
        </Form.Item>

        <Form.Item
          name="price"
          label="Price:"
          style={{ flex: 1 }}
          rules={studentFormRules.price}
        >
          <InputNumber
            min={0}
            placeholder="500"
            addonAfter={<CurrencySelect />}
          />
        </Form.Item>
      </Flex>

      <Form.Item name="notes" label="Notes:">
        <TextArea rows={2} placeholder="Preparing for english exam" />
      </Form.Item>

      <AvatarUploader fileList={fileList} setFileList={setFileList} />

      <Form.Item>
        <Flex justify="flex-end" gap={12}>
          <Button htmlType="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            {mode === 'create' ? 'Create' : 'Update'}
          </Button>
        </Flex>
      </Form.Item>
    </Form>
  );
};

export default StudentForm;
