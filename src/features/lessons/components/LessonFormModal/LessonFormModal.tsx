import { type FC, useEffect, useState } from 'react';

import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import {
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Switch,
} from 'antd';
import dayjs from 'dayjs';
import { Timestamp } from 'firebase/firestore';

import { useGetGroupsQuery } from '@/features/groups/api/groupsApi';
import { useLessonActions } from '@/features/lessons/hooks/useLessonActions';
import type {
  LessonData,
  LessonFormModalProps,
  LessonFormValues,
} from '@/features/lessons/types/lessonTypes';
import { useGetStudentsQuery } from '@/features/students/api/studentsApi';
import { studentFormRules } from '@/features/students/components/StudentForm/validationFormFields';
import CurrencySelect from '@/shared/components/UI/CurrencySelect';
import { useErrorHandler } from '@/shared/hooks/useErrorHandler';

const { RangePicker } = DatePicker;

const LessonFormModal: FC<LessonFormModalProps> = ({
  isModalOpen,
  onClose,
  editedLesson,
  defaultStudent,
  defaultGroup,
}) => {
  const [form] = Form.useForm<LessonFormValues>();
  const { data: students = [] } = useGetStudentsQuery();
  const { data: groups = [] } = useGetGroupsQuery();
  const { updateLessonData, createLesson } = useLessonActions();
  const { handleError } = useErrorHandler();
  const [isGroup, setIsGroup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editedLesson) {
      form.setFieldsValue({
        studentIds: editedLesson.studentIds,
        groupId: editedLesson.groupId,
        date: [dayjs(editedLesson.start), dayjs(editedLesson.end)],
        notes: editedLesson.notes || null,
        price: editedLesson.price,
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
        price: defaultGroup.price,
      });
      setIsGroup(!!defaultGroup.id);
    } else {
      form.resetFields();
    }
  }, [defaultGroup, form]);

  useEffect(() => {
    if (defaultStudent) {
      form.setFieldsValue({
        studentIds: [defaultStudent],
        // price: defaultStudent.price,
        // add price
      });
    } else {
      form.resetFields();
    }
  }, [defaultStudent, form]);

  const handleFinish = async () => {
    setIsLoading(true);
    try {
      const formValues: LessonFormValues = await form.validateFields();
      const reqValues: LessonData = {
        studentIds: formValues.studentIds,
        groupId: formValues.groupId || null,
        start: Timestamp.fromMillis(formValues.date[0].valueOf()),
        end: Timestamp.fromMillis(formValues.date[1].valueOf()),
        notes: formValues.notes || null,
        price: formValues.price,
      };

      if (editedLesson) {
        await updateLessonData(editedLesson.id, reqValues);
      } else {
        await createLesson(reqValues);
      }
      onClose();
      form.resetFields();
    } catch (err) {
      handleError(err, 'Lesson form error');
    } finally {
      setIsLoading(false);
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
        groupId: null,
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
      confirmLoading={isLoading}
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
