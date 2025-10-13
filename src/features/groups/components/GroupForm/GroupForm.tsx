import { type FC } from 'react';

import { Button, Flex, Form, Input, InputNumber, Select } from 'antd';

import { useGroupForm } from '@/features/groups/hooks/useGroupForm';
import { studentFormRules } from '@/features/students/utils/validationFormFields';
import CurrencySelect from '@/shared/components/UI/CurrencySelect/CurrencySelect';

const { TextArea } = Input;

interface GroupFormProps {
  mode?: string;
  onClose: () => void;
  groupId?: string | null;
}

const GroupForm: FC<GroupFormProps> = ({ onClose, mode, groupId }) => {
  const { form, onFinish, studentOptions, isLoading } = useGroupForm({
    groupId,
    onClose,
  });

  return (
    <Form form={form} onFinish={onFinish} layout="vertical" name="group_form">
      <Form.Item
        label="Title:"
        name="title"
        rules={[{ required: true, message: 'Enter title' }]}
      >
        <Input placeholder="Best group ever" />
      </Form.Item>

      <Form.Item
        name="studentIds"
        label="Students:"
        rules={[{ required: true }]}
      >
        <Select
          mode="multiple"
          placeholder="Select students"
          options={studentOptions}
        />
      </Form.Item>

      <Form.Item name="price" label="Price:" rules={studentFormRules.price}>
        <InputNumber
          min={0}
          placeholder="500"
          addonAfter={<CurrencySelect />}
        />
      </Form.Item>

      <Form.Item label="Notes:" name="notes">
        <TextArea rows={3} placeholder="Note some info here" />
      </Form.Item>

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

export default GroupForm;
