import { type FC, useState } from 'react';

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

import { useStudentForm } from '@/features/students/hooks/useStudentForm';
import type { Student } from '@/features/students/types/studentTypes';
import { studentFormRules } from '@/features/students/utils/validationFormFields';
import AvatarUploader from '@/shared/components/UI/AvatarUploader/AvatarUploader';

const DATE_FORMAT = 'DD.MM.YYYY';

const langLevels = [
  { value: 'A1', label: 'A1' },
  { value: 'A2', label: 'A2' },
  { value: 'B1', label: 'B1' },
  { value: 'B2', label: 'B2' },
  { value: 'C1', label: 'C1' },
  { value: 'C2', label: 'C2' },
];

interface StudentFormProps {
  mode?: string;
  onClose: () => void;
  student?: Student | null;
}

const StudentForm: FC<StudentFormProps> = ({ mode, onClose, student }) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const { form, onFinish, isLoading } = useStudentForm({
    student,
    onClose,
    fileList,
    setFileList,
  });

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
        <DatePicker format={DATE_FORMAT} placeholder={DATE_FORMAT} />
      </Form.Item>

      <Flex justify="space-between" gap={24}>
        <Form.Item
          name="currentLevel"
          label="Current level:"
          rules={studentFormRules.level}
        >
          <Select options={langLevels} />
        </Form.Item>

        <Form.Item name="price" label="Price:" rules={studentFormRules.price}>
          <InputNumber min={0} placeholder="500" addonAfter="UAH ₴" />
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
