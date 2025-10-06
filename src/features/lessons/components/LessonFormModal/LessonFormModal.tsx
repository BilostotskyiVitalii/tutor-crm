import { type FC } from 'react';

import { DatePicker, Form, Input, InputNumber, Modal } from 'antd';

import { useGetGroupsQuery } from '@/features/groups/api/groupsApi';
import { useGetLessonsQuery } from '@/features/lessons/api/lessonsApi';
import LessonFormGroupSelect from '@/features/lessons/components/LessonFormGroupSelect/LessonFormGroupSelect';
import UsersSelect from '@/features/lessons/components/LessonFormUsersSelect/LessonFormUsersSelect';
import { useLessonActions } from '@/features/lessons/hooks/useLessonActions';
import { useLessonForm } from '@/features/lessons/hooks/useLessonForm';
import type {
  LessonFormModalProps,
  LessonFormValues,
} from '@/features/lessons/types/lessonTypes';
import { useGetStudentsQuery } from '@/features/students/api/studentsApi';
import { studentFormRules } from '@/features/students/utils/validationFormFields';
import CurrencySelect from '@/shared/components/UI/CurrencySelect/CurrencySelect';
import { useErrorHandler } from '@/shared/hooks/useErrorHandler';

const { RangePicker } = DatePicker;

const LessonFormModal: FC<LessonFormModalProps> = ({
  isModalOpen,
  onClose,
  editedLessonId,
  defaultStudent,
  defaultGroup,
}) => {
  const [form] = Form.useForm<LessonFormValues>();
  const { data: students = [] } = useGetStudentsQuery();
  const { data: groups = [] } = useGetGroupsQuery();
  const { data: lessons = [] } = useGetLessonsQuery();
  const { updateLessonData, createLesson } = useLessonActions();
  const { handleError } = useErrorHandler();

  const { isGroup, setIsGroup, isLoading, handleFinish, handleCancel } =
    useLessonForm({
      form,
      editedLessonId,
      defaultStudent,
      defaultGroup,
      students,
      lessons,
      groups,
      updateLessonData,
      createLesson,
      handleError,
      onClose,
    });

  return (
    <Modal
      title={editedLessonId ? 'Edit Lesson' : 'Create Lesson'}
      open={isModalOpen}
      onCancel={() => {
        handleCancel();
        onClose();
      }}
      onOk={handleFinish}
      okText={editedLessonId ? 'Update' : 'Create'}
      cancelText="Cancel"
      confirmLoading={isLoading}
    >
      <Form form={form} layout="vertical">
        <UsersSelect editedLessonId={editedLessonId} />

        <LessonFormGroupSelect
          isGroup={isGroup}
          setIsGroup={setIsGroup}
          form={form}
        />

        <Form.Item name="date" label="Date:" rules={[{ required: true }]}>
          <RangePicker
            showTime={{ format: 'HH:mm' }}
            format="DD.MM.YYYY HH:mm"
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

        <Form.Item name="notes" label="Notes:">
          <Input.TextArea rows={3} placeholder="Note some info here" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default LessonFormModal;
