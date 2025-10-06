import { DatePicker, Flex, Form, Input, InputNumber, Select } from 'antd';

import { studentFormRules } from '@/features/students/utils/validationFormFields';
import CurrencySelect from '@/shared/components/UI/CurrencySelect/CurrencySelect';
import { langLevels } from '@/shared/constants/varaibles';

const { TextArea } = Input;

const StudentFormFields = () => (
  <>
    <Form.Item name="name" label="Name:" rules={studentFormRules.name}>
      <Input placeholder="John Snow" />
    </Form.Item>

    <Form.Item name="email" label="Email:" rules={studentFormRules.email}>
      <Input placeholder="student@mail.com" />
    </Form.Item>

    <Form.Item name="phone" label="Phone:" rules={studentFormRules.phone}>
      <Input placeholder="+380667462269" />
    </Form.Item>

    <Form.Item name="contact" label="Contact:">
      <Input placeholder="Link to insta, telegram, etc..." />
    </Form.Item>

    <Form.Item name="birthdate" label="Birthdate:">
      <DatePicker format="DD.MM.YYYY" placeholder="DD.MM.YYYY" />
    </Form.Item>

    <Flex justify="space-between" gap={24}>
      <Form.Item
        name="currentLevel"
        label="Current level:"
        style={{ flex: 1 }}
        rules={studentFormRules.level}
      >
        <Select options={langLevels} />
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
    </Flex>

    <Form.Item name="notes" label="Notes:">
      <TextArea rows={2} placeholder="Preparing for english exam" />
    </Form.Item>
  </>
);

export default StudentFormFields;
