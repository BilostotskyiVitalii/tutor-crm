import { type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

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
import { getStudentFormRules } from '@/features/students/utils/validationFormFields';
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
  const { t } = useTranslation();
  const studentFormRules = getStudentFormRules(t);

  return (
    <Form form={form} onFinish={onFinish} layout="vertical" name="student_form">
      <Form.Item
        name="name"
        label={`${t('form.nameLabel')}`}
        rules={studentFormRules.name}
      >
        <Input placeholder={`${t('form.namePlh')}`} />
      </Form.Item>

      <Form.Item
        name="email"
        label={`${t('form.emailLabel')}`}
        rules={studentFormRules.email}
      >
        <Input placeholder={`${t('form.emailPlh')}`} />
      </Form.Item>

      <Form.Item
        name="phone"
        label={`${t('form.phoneLabel')}`}
        rules={studentFormRules.phone}
      >
        <Input placeholder={`${t('form.phonePlh')}`} />
      </Form.Item>

      <Form.Item name="contact" label={`${t('form.contactLabel')}`}>
        <Input placeholder={`${t('form.contactPlh')}`} />
      </Form.Item>

      <Form.Item name="birthdate" label={`${t('form.birthdateLabel')}`}>
        <DatePicker format={DATE_FORMAT} placeholder={DATE_FORMAT} />
      </Form.Item>

      <Flex justify="space-between" gap={24}>
        <Form.Item
          name="currentLevel"
          label={`${t('form.levelLabel')}`}
          rules={studentFormRules.level}
        >
          <Select options={langLevels} />
        </Form.Item>

        <Form.Item
          name="price"
          label={`${t('form.priceLabel')}:`}
          rules={studentFormRules.price}
        >
          <InputNumber
            min={0}
            placeholder={`${t('form.pricePlh')}`}
            addonAfter="UAH ₴"
          />
        </Form.Item>
      </Flex>

      <Form.Item name="notes" label={`${t('form.notesLabel')}:`}>
        <TextArea rows={2} placeholder={`${t('form.notePlh')}`} />
      </Form.Item>

      <AvatarUploader fileList={fileList} setFileList={setFileList} />

      <Form.Item>
        <Flex justify="flex-end" gap={12}>
          <Button htmlType="button" onClick={onClose}>
            {t('cancel')}
          </Button>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            {mode === 'create' ? `${t('create')}` : `${t('update')}`}
          </Button>
        </Flex>
      </Form.Item>
    </Form>
  );
};

export default StudentForm;
