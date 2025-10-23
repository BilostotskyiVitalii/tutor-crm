import { useEffect, useMemo, useState } from 'react';

import { Form } from 'antd';

import { useGroupActions } from '@/features/groups/hooks/useGroupActions';
import type { Group, GroupData } from '@/features/groups/types/groupTypes';
import { useGetStudentsQuery } from '@/features/students/api/studentsApi';
import { useErrorHandler } from '@/shared/hooks/useErrorHandler';
import { getChangedFields } from '@/shared/utils/getChangedFields';
import { toNullData } from '@/shared/utils/toNullData';

interface useGroupFormProps {
  group?: Group | null;
  onClose: () => void;
}

export const useGroupForm = ({ group, onClose }: useGroupFormProps) => {
  const [form] = Form.useForm<GroupData>();
  const [isLoading, setIsLoading] = useState(false);
  const { data: students = [] } = useGetStudentsQuery();
  const { createGroup, updateGroupData } = useGroupActions();
  const { handleError } = useErrorHandler();

  useEffect(() => {
    if (group) {
      form.setFieldsValue({ ...group });
    }
  }, [group, form]);

  const studentOptions = useMemo(
    () =>
      students
        .filter((s) => s.isActive)
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((s) => ({ label: s.name, value: s.id })),
    [students],
  );

  const handleFinish = async () => {
    try {
      setIsLoading(true);

      const formValues: GroupData = await form.validateFields();
      const updateData = toNullData(formValues);

      if (group) {
        const changedFields = getChangedFields(updateData, group);

        if (Object.keys(changedFields).length > 0) {
          await updateGroupData(group.id, changedFields);
        }
      } else {
        await createGroup(updateData);
      }

      onClose();
    } catch (err) {
      handleError(err, 'Group form error!');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    handleFinish,
    studentOptions,
    isLoading,
  };
};
