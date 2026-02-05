import { type FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Flex, Form, Input, InputNumber, Select } from 'antd';

import { useGroupForm } from '@/features/groups/hooks/useGroupForm';
import type { Group } from '@/features/groups/types/groupTypes';
import { getStudentFormRules } from '@/features/students/utils/validationFormFields';

const { TextArea } = Input;

interface GroupFormProps {
  mode?: string;
  onClose: () => void;
  group?: Group | null;
}

const GroupForm: FC<GroupFormProps> = ({ onClose, mode, group }) => {
  const { form, handleFinish, studentOptions, isLoading } = useGroupForm({
    group,
    onClose,
  });
  const { t } = useTranslation();
  const studentFormRules = getStudentFormRules(t);

  return (
    <Form
      form={form}
      onFinish={handleFinish}
      layout="vertical"
      name="group_form"
    >
      <Form.Item
        label={`${t('form.titleLabel')}:`}
        name="title"
        rules={[{ required: true, message: `${t('form.ruleMessage')}:` }]}
      >
        <Input placeholder={`${t('form.titlePlh')}`} />
      </Form.Item>

      <Form.Item
        name="studentIds"
        label={`${t('form.studentsLabel')}:`}
        rules={[{ required: true }]}
      >
        <Select
          mode="multiple"
          placeholder={`${t('form.studentsPlh')}`}
          options={studentOptions}
        />
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

      <Form.Item label={`${t('form.notesLabel')}:`} name="notes">
        <TextArea rows={3} placeholder={`${t('form.notePlh')}`} />
      </Form.Item>

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

export default GroupForm;
