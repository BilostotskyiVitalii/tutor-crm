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
import { studentFormRules } from '@/features/students/utils/validationFormFields';
import AvatarUploader from '@/shared/components/UI/AvatarUploader/AvatarUploader';
import CurrencySelect from '@/shared/components/UI/CurrencySelect/CurrencySelect';
import { langLevels } from '@/shared/constants/varaibles';

const DATE_FORMAT = 'DD.MM.YYYY';

interface StudentFormProps {
  mode?: string;
  onClose: () => void;
  studentId?: string | null;
}

const StudentForm: FC<StudentFormProps> = ({ mode, onClose, studentId }) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const { form, onFinish, isLoading } = useStudentForm({
    studentId,
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
