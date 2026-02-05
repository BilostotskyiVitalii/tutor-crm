import { type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

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
import { getStudentFormRules } from '@/features/students/utils/validationFormFields';
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
  const { t } = useTranslation();
  const studentFormRules = getStudentFormRules(t);

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <LessonFormUsersSelect editedLesson={lesson} />

      <LessonFormGroupSelect
        isGroup={isGroup}
        setIsGroup={setIsGroup}
        form={form}
      />

      <Form.Item
        name="date"
        label={`${t('date')}: `}
        rules={[{ required: true }]}
      >
        <RangePicker showTime={SHOW_TIME_FORMAT} format={DATE_TIME_FORMAT} />
      </Form.Item>

      <Form.Item
        name="price"
        label={`${t('form.priceLabel')}: `}
        rules={studentFormRules.price}
      >
        <InputNumber
          min={0}
          placeholder={`${t('form.pricePlh')}`}
          addonAfter="UAH ₴"
        />
      </Form.Item>

      <Form.Item name="notes" label={`${t('form.notesLabel')}: `}>
        <Input.TextArea rows={3} placeholder={`${t('form.notePlh')}`} />
      </Form.Item>

      <Form.Item>
        <Flex justify={mode === 'edit' ? 'space-between' : 'flex-end'}>
          {mode === 'edit' && (
            <Space>
              <Button danger htmlType="button" onClick={onDeleteHandler}>
                {t('delete')}
              </Button>
            </Space>
          )}
          <Space>
            <Button htmlType="button" onClick={onClose}>
              {t('cancel')}
            </Button>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              {mode === 'create' ? `${t('create')}` : `${t('update')}`}
            </Button>
          </Space>
        </Flex>
      </Form.Item>
    </Form>
  );
};

export default LessonForm;
