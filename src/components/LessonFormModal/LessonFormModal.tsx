import { type FC, useEffect, useState } from 'react';

import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import {
  DatePicker,
  Form,
  Input,
  Modal,
  notification,
  Select,
  Switch,
} from 'antd';
import dayjs from 'dayjs';

import { useErrorHandler } from '@/hooks/useErrorHandler';
import { useGetGroupsQuery } from '@/store/groupsApi';
import {
  useAddLessonMutation,
  useUpdateLessonMutation,
} from '@/store/lessonsApi';
import { useGetStudentsQuery } from '@/store/studentsApi';
import type { Group } from '@/types/groupTypes';
import type { Lesson, LessonData, LessonFormValues } from '@/types/lessonTypes';

const { RangePicker } = DatePicker;

interface LessonFormModalProps {
  isModalOpen: boolean;
  onClose: () => void;
  editedLesson?: Lesson | null;
  defaultStudents?: string[];
  defaultGroup?: Group | null;
}

const LessonFormModal: FC<LessonFormModalProps> = ({
  isModalOpen,
  onClose,
  editedLesson,
  defaultStudents,
  defaultGroup,
}) => {
  const [form] = Form.useForm<LessonFormValues>();
  const { data: students = [] } = useGetStudentsQuery();
  const { data: groups = [] } = useGetGroupsQuery();
  const [addLesson] = useAddLessonMutation();
  const [updateLesson] = useUpdateLessonMutation();
  const { handleError } = useErrorHandler();
  const [isGroup, setIsGroup] = useState(false);

  useEffect(() => {
    if (editedLesson) {
      form.setFieldsValue({
        studentIds: editedLesson.studentIds,
        groupId: editedLesson.groupId,
        date: [dayjs(editedLesson.start), dayjs(editedLesson.end)],
        notes: editedLesson.notes ?? '',
      });
      setIsGroup(!!editedLesson.groupId);
    } else {
      form.resetFields();
    }
  }, [editedLesson, form]);

  useEffect(() => {
    if (defaultGroup) {
      form.setFieldsValue({
        studentIds: defaultGroup.studentIds,
        groupId: defaultGroup.id,
      });
      setIsGroup(!!defaultGroup.id);
    } else {
      form.resetFields();
    }
  }, [defaultGroup, form]);

  useEffect(() => {
    if (defaultStudents) {
      form.setFieldsValue({
        studentIds: defaultStudents,
      });
    } else {
      form.resetFields();
    }
  }, [defaultStudents, form]);

  const handleFinish = async () => {
    try {
      const values: LessonFormValues = await form.validateFields();

      const reqValues: LessonData = {
        studentIds: values.studentIds,
        groupId: values.groupId ?? '',
        start: values.date[0].valueOf(),
        end: values.date[1].valueOf(),
        notes: values.notes ?? '',
      };

      if (editedLesson) {
        await updateLesson({ id: editedLesson.id, data: reqValues }).unwrap();
        notification.success({ message: 'Lesson updated!' });
      } else {
        await addLesson(reqValues).unwrap();
        notification.success({ message: 'Lesson created!' });
      }
      onClose();
      form.resetFields();
    } catch (err) {
      handleError(err, 'Lesson form error');
    }
  };

  function handleCancel() {
    onClose();
    form.resetFields();
  }

  function selectGroupHandler(groupId: string) {
    const group = groups.find((g) => g.id === groupId);
    if (group) {
      form.setFieldsValue({
        studentIds: group.studentIds,
      });
    }
  }

  function onGroupSwitch(checked: boolean) {
    setIsGroup(checked);

    if (!checked) {
      form.setFieldsValue({
        groupId: '',
        studentIds: [],
      });
    }
  }

  return (
    <Modal
      title={editedLesson ? 'Edit Lesson' : 'Create Lesson'}
      open={isModalOpen}
      onCancel={handleCancel}
      onOk={handleFinish}
      okText={editedLesson ? 'Update' : 'Create'}
      cancelText="Cancel"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="studentIds"
          label="Students:"
          rules={[{ required: true }]}
        >
          <Select
            mode="multiple"
            placeholder="Select students"
            options={students.map((s) => ({ label: s.name, value: s.id }))}
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>

        <Form.Item
          name="groupId"
          label={
            <div>
              <span>Group: </span>
              <Switch
                size="small"
                checked={isGroup}
                onChange={onGroupSwitch}
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
              />
            </div>
          }
        >
          <Select
            disabled={!isGroup}
            placeholder="Select group"
            options={groups.map((g) => ({ label: g.title, value: g.id }))}
            onChange={selectGroupHandler}
          />
        </Form.Item>

        <Form.Item name="date" label="Date:" rules={[{ required: true }]}>
          <RangePicker
            showTime={{ format: 'HH:mm' }}
            format="DD.MM.YYYY HH:mm"
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
