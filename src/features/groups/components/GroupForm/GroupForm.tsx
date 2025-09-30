import { type FC, useEffect, useState } from 'react';

import { Form, Input, Modal, Select } from 'antd';

import { useGroupActions } from '@/features/groups/hooks/useGroupActions';
import type { Group, GroupData } from '@/features/groups/types/groupTypes';
import { useGetStudentsQuery } from '@/features/students/api/studentsApi';
import { useErrorHandler } from '@/shared/hooks/useErrorHandler';

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
  const { createGroup, updateGroupData } = useGroupActions();
  const [isLoading, setIsLoading] = useState(false);
  const { handleError } = useErrorHandler();

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
      setIsLoading(true);
      const formValues: GroupData = await form.validateFields();

      if (editedGroup) {
        await updateGroupData(editedGroup.id, formValues);
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
      title={editedGroup ? 'Update Group' : 'New Group'}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={editedGroup ? 'Update' : 'Create'}
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
