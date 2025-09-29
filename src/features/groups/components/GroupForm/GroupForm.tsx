import { type FC, useEffect } from 'react';

import { Form, Input, Modal, notification, Select } from 'antd';

import {
  useAddGroupMutation,
  useUpdateGroupMutation,
} from '@/features/groups/api/groupsApi';
import type { Group, GroupData } from '@/features/groups/types/groupTypes';
import { useGetStudentsQuery } from '@/features/students/api/studentsApi';

const { TextArea } = Input;

interface GroupFormProps {
  isModalOpen: boolean;
  onClose: () => void;
  editedGroup?: Group | null;
}

const GroupForm: FC<GroupFormProps> = ({
  onClose,
  isModalOpen,
  editedGroup,
}) => {
  const [form] = Form.useForm<GroupData>();
  const { data: students = [] } = useGetStudentsQuery();
  const [addGroup] = useAddGroupMutation();
  const [updateGroup] = useUpdateGroupMutation();

  useEffect(() => {
    if (isModalOpen && editedGroup) {
      form.setFieldsValue({
        ...editedGroup,
      });
    } else {
      form.resetFields();
    }
  }, [isModalOpen, editedGroup, form]);

  const handleCancel = () => {
    onClose();
    form.resetFields();
  };

  const handleOk = async () => {
    try {
      const formValues: GroupData = await form.validateFields();

      if (editedGroup) {
        await updateGroup({
          id: editedGroup.id,
          data: formValues,
        }).unwrap();
        notification.success({ message: 'Group updated!' });
      } else {
        await addGroup(formValues).unwrap();
        notification.success({ message: 'Group created!' });
      }

      handleCancel();
    } catch {
      notification.error({ message: 'Group form error!' });
    }
  };

  return (
    <Modal
      title={editedGroup ? 'Update Group' : 'New Group'}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={editedGroup ? 'Update' : 'Create'}
      cancelText="Cancel"
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
            options={students.map((s) => ({ label: s.name, value: s.id }))}
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
