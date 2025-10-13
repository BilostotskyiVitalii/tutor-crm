import type { FC } from 'react';

import { Form, Select } from 'antd';

import { useGetLessonByIdQuery } from '@/features/lessons/api/lessonsApi';
import { useGetStudentsQuery } from '@/features/students/api/studentsApi';

type LessonFormUsersSelectProps = {
  editedLessonId?: string | null;
  value?: string[];
  onChange?: (val: string[]) => void;
};

export const LessonFormUsersSelect: FC<LessonFormUsersSelectProps> = ({
  editedLessonId,
  value,
  onChange,
}) => {
  const { data: students = [] } = useGetStudentsQuery();
  const { data: lesson } = useGetLessonByIdQuery(editedLessonId ?? '');

  const activeStudents = students
    .filter((s) => s.isActive)
    .map((s) => ({ label: s.name, value: s.id }));

  const extraStudents =
    lesson?.students.map((s) => {
      const fullData = students.find((st) => st.id === s.id);
      let label = fullData?.name || s.name || s.id;

      if (!fullData) {
        label += ' (deleted)';
      } else if (!fullData.isActive) {
        label += ' (inactive)';
      }

      return { label, value: s.id };
    }) || [];

  const studentOptions = [...activeStudents, ...extraStudents].filter(
    (option, index, self) =>
      index === self.findIndex((o) => o.value === option.value),
  );

  return (
    <Form.Item name="studentIds" label="Students:" rules={[{ required: true }]}>
      <Select
        mode="multiple"
        placeholder="Select students"
        options={studentOptions}
        value={value}
        onChange={onChange}
        filterOption={(input, option) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
        loading={students.length === 0}
      />
    </Form.Item>
  );
};
