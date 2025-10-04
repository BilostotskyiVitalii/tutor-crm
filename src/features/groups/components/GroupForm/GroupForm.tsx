import { type FC, useEffect, useMemo, useState } from 'react';

import { Form, Input, InputNumber, Modal, Select } from 'antd';

import { useGetGroupsQuery } from '@/features/groups/api/groupsApi';
import { useGroupActions } from '@/features/groups/hooks/useGroupActions';
import type {
  GroupData,
  GroupFormProps,
} from '@/features/groups/types/groupTypes';
import { useGetStudentsQuery } from '@/features/students/api/studentsApi';
import { studentFormRules } from '@/features/students/components/StudentForm/validationFormFields';
import CurrencySelect from '@/shared/components/UI/CurrencySelect';
import { useErrorHandler } from '@/shared/hooks/useErrorHandler';

const { TextArea } = Input;

const GroupForm: FC<GroupFormProps> = ({
  onClose,
  isModalOpen,
  editedGroupId,
}) => {
  const [form] = Form.useForm<GroupData>();
  const { data: students = [] } = useGetStudentsQuery();
  const { data: groups = [] } = useGetGroupsQuery();
  const { createGroup, updateGroupData } = useGroupActions();
  const [isLoading, setIsLoading] = useState(false);
  const { handleError } = useErrorHandler();

  const group = useMemo(
    () => (editedGroupId ? groups.find((g) => g.id === editedGroupId) : null),
    [editedGroupId, groups],
  );

  // вычисляем список студентов (активные + уже выбранные неактивные)
  const studentOptions = useMemo(() => {
    const selectedIds = group?.studentIds ?? [];

    return students
      .filter((s) => s.isActive || selectedIds.includes(s.id))
      .map((s) => ({
        label: (
          <span style={{ color: s.isActive ? 'inherit' : '#999' }}>
            {s.name}
            {!s.isActive && ' (inactive)'}
          </span>
        ),
        value: s.id,
      }));
  }, [students, group]);

  useEffect(() => {
    if (isModalOpen && group) {
      form.setFieldsValue(group);
    } else {
      form.resetFields();
    }
  }, [isModalOpen, group, form]);

  const handleCancel = () => {
    onClose();
    form.resetFields();
  };

  const handleOk = async () => {
    try {
      setIsLoading(true);
      const formValues: GroupData = await form.validateFields();

      if (editedGroupId) {
        await updateGroupData(editedGroupId, formValues);
      } else {
        await createGroup(formValues);
      }

      handleCancel();
    } catch (err) {
      handleError(err, 'Group form error!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title={editedGroupId ? 'Update Group' : 'New Group'}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={editedGroupId ? 'Update' : 'Create'}
      cancelText="Cancel"
      confirmLoading={isLoading}
    >
      <Form form={form} layout="vertical" name="group_form">
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
      </Form>
    </Modal>
  );
};

export default GroupForm;
