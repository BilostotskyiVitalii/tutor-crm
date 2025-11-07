import { type FC, useState } from 'react';

import {
  Button,
  DatePicker,
  Flex,
  Form,
  Input,
  InputNumber,
  Space,
} from 'antd';

import LessonFormGroupSelect from '@/features/lessons/components/LessonFormGroupSelect/LessonFormGroupSelect';
import { LessonFormUsersSelect } from '@/features/lessons/components/LessonFormUsersSelect/LessonFormUsersSelect';
import { useLessonForm } from '@/features/lessons/hooks/useLessonForm';
import type { Lesson } from '@/features/lessons/types/lessonTypes';
import { studentFormRules } from '@/features/students/utils/validationFormFields';
import type { initDataType, ModeType } from '@/shared/types/modalTypes';

const { RangePicker } = DatePicker;

const DATE_TIME_FORMAT = 'DD.MM.YYYY HH:mm';
const SHOW_TIME_FORMAT = { format: 'HH:mm' };

interface LessonFormProps {
  mode?: ModeType;
  onClose: () => void;
  lesson?: Lesson | null;
  initData?: initDataType;
}

const LessonForm: FC<LessonFormProps> = ({
  mode,
  onClose,
  lesson,
  initData,
}) => {
  const [isGroup, setIsGroup] = useState(false);
  const { form, onFinish, onDeleteHandler, isLoading } = useLessonForm({
    initData,
    lesson,
    onClose,
    setIsGroup,
  });

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <LessonFormUsersSelect editedLesson={lesson} />

      <LessonFormGroupSelect
        isGroup={isGroup}
        setIsGroup={setIsGroup}
        form={form}
      />

      <Form.Item name="date" label="Date:" rules={[{ required: true }]}>
        <RangePicker showTime={SHOW_TIME_FORMAT} format={DATE_TIME_FORMAT} />
      </Form.Item>

      <Form.Item name="price" label="Price:" rules={studentFormRules.price}>
        <InputNumber min={0} placeholder="500" addonAfter="UAH ₴" />
      </Form.Item>

      <Form.Item name="notes" label="Notes:">
        <Input.TextArea rows={3} placeholder="Note some info here" />
      </Form.Item>

      <Form.Item>
        <Flex justify={mode === 'edit' ? 'space-between' : 'flex-end'}>
          {mode === 'edit' && (
            <Space>
              <Button danger htmlType="button" onClick={onDeleteHandler}>
                Delete
              </Button>
            </Space>
          )}
          <Space>
            <Button htmlType="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              {mode === 'create' ? 'Create' : 'Update'}
            </Button>
          </Space>
        </Flex>
      </Form.Item>
    </Form>
  );
};

export default LessonForm;
