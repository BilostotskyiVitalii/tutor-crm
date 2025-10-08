import { type FC, useEffect, useMemo, useState } from 'react';

import { Button, Flex, Form, Input, InputNumber, Select } from 'antd';

import { useGetGroupsQuery } from '@/features/groups/api/groupsApi';
import { useGroupActions } from '@/features/groups/hooks/useGroupActions';
import type { GroupData } from '@/features/groups/types/groupTypes';
import { useGetStudentsQuery } from '@/features/students/api/studentsApi';
import { studentFormRules } from '@/features/students/utils/validationFormFields';
import CurrencySelect from '@/shared/components/UI/CurrencySelect/CurrencySelect';
import { useErrorHandler } from '@/shared/hooks/useErrorHandler';

const { TextArea } = Input;

interface GroupFormProps {
  mode?: string;
  onClose: () => void;
  groupId?: string | null;
}

const GroupForm: FC<GroupFormProps> = ({ onClose, mode, groupId }) => {
  const [form] = Form.useForm<GroupData>();
  const { data: students = [] } = useGetStudentsQuery();
  const { data: groups = [] } = useGetGroupsQuery();
  const { createGroup, updateGroupData } = useGroupActions();
  const [isLoading, setIsLoading] = useState(false);
  const { handleError } = useErrorHandler();

  const group = useMemo(
    () => (groupId ? groups.find((g) => g.id === groupId) : null),
    [groupId, groups],
  );

  const studentOptions = useMemo(() => {
    return students
      .filter((s) => s.isActive)
      .map((s) => ({
        label: s.name,
        value: s.id,
      }));
  }, [students]);

  useEffect(() => {
    if (group) {
      // TODO Why notes separetly?
      form.setFieldsValue({ ...group, notes: group?.notes ?? null });
    }
  }, [group, students, form]);

  const onFinish = async () => {
    try {
      setIsLoading(true);
      const formValues: GroupData = await form.validateFields();
      const normalizedFormValues = {
        ...formValues,
        notes: formValues.notes?.trim() ? formValues.notes.trim() : null,
      };

      if (groupId) {
        await updateGroupData(groupId, normalizedFormValues);
      } else {
        await createGroup(normalizedFormValues);
      }

      onClose();
    } catch (err) {
      handleError(err, 'Group form error!');
    } finally {
      setIsLoading(false);
    }
  };

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

      <Form.Item label="Notes:" name="notes">
        <TextArea rows={3} placeholder="Note some info here" />
      </Form.Item>

      <Form.Item>
        <Flex justify="flex-end" gap={12}>
          <Button htmlType="button" onClick={() => onClose()}>
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
