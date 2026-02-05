import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Form, Select } from 'antd';

import type { Lesson } from '@/features/lessons/types/lessonTypes';
import { useGetStudentsQuery } from '@/features/students/api/studentsApi';

type LessonFormUsersSelectProps = {
  editedLesson?: Lesson | null;
  value?: string[];
  onChange?: (val: string[]) => void;
};

export const LessonFormUsersSelect: FC<LessonFormUsersSelectProps> = ({
  editedLesson,
  value,
  onChange,
}) => {
  const { data: students = [] } = useGetStudentsQuery();
  const { t } = useTranslation();

  const activeStudents = students
    .filter((s) => s.isActive)
    .map((s) => ({ label: s.name, value: s.id }));

  const extraStudents =
    editedLesson?.students.map((s) => {
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
    <Form.Item
      name="studentIds"
      label={`${t('form.studentsLabel')}:`}
      rules={[{ required: true }]}
    >
      <Select
        mode="multiple"
        placeholder={`${t('form.studentsPlh')}:`}
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
