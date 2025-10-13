import { useEffect, useMemo, useState } from 'react';

import { Form } from 'antd';

import { useGetGroupByIdQuery } from '@/features/groups/api/groupsApi';
import { useGroupActions } from '@/features/groups/hooks/useGroupActions';
import type { GroupData } from '@/features/groups/types/groupTypes';
import { useGetStudentsQuery } from '@/features/students/api/studentsApi';
import { useErrorHandler } from '@/shared/hooks/useErrorHandler';

interface useGroupFormProps {
  groupId?: string | null;
  onClose: () => void;
}

export const useGroupForm = ({ groupId, onClose }: useGroupFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm<GroupData>();
  const { data: students = [] } = useGetStudentsQuery();
  const { data: group } = useGetGroupByIdQuery(groupId ?? '');
  const { createGroup, updateGroupData } = useGroupActions();
  const { handleError } = useErrorHandler();

  useEffect(() => {
    if (group) {
      // TODO Why notes separetly?
      form.setFieldsValue({ ...group, notes: group?.notes ?? null });
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
      const normalizedFormValues = {
        ...formValues,
        notes: formValues.notes?.trim() || null,
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

  return {
    form,
    handleFinish,
    studentOptions,
    isLoading,
  };
};
