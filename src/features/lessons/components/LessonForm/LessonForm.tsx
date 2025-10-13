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
import UsersSelect from '@/features/lessons/components/LessonFormUsersSelect/LessonFormUsersSelect';
import { useLessonForm } from '@/features/lessons/hooks/useLessonForm';
import { studentFormRules } from '@/features/students/utils/validationFormFields';
import CurrencySelect from '@/shared/components/UI/CurrencySelect/CurrencySelect';
import type { initDataType, ModeType } from '@/shared/types/modalTypes';

const { RangePicker } = DatePicker;

const DATE_TIME_FORMAT = 'DD.MM.YYYY HH:mm';
const SHOW_TIME_FORMAT = { format: 'HH:mm' };

interface LessonFormProps {
  mode?: ModeType;
  onClose: () => void;
  lessonId?: string | null;
  initData?: initDataType;
}

const LessonForm: FC<LessonFormProps> = ({
  mode,
  onClose,
  lessonId,
  initData,
}) => {
  const [isGroup, setIsGroup] = useState(false);
  const { form, onFinish, onDeleteHandler, isLoading } = useLessonForm({
    initData,
    lessonId,
    onClose,
    setIsGroup,
  });

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <UsersSelect editedLessonId={lessonId} />

      <LessonFormGroupSelect
        isGroup={isGroup}
        setIsGroup={setIsGroup}
        form={form}
      />

      <Form.Item name="date" label="Date:" rules={[{ required: true }]}>
        <RangePicker showTime={SHOW_TIME_FORMAT} format={DATE_TIME_FORMAT} />
      </Form.Item>

      <Form.Item name="price" label="Price:" rules={studentFormRules.price}>
        <InputNumber
          min={0}
          placeholder="500"
          addonAfter={<CurrencySelect />}
        />
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
