import { DatePicker, Flex, Form, Input, InputNumber, Select } from 'antd';

import { studentFormRules } from '@/shared/constants/validation';
import { langLevels } from '@/shared/constants/varaibles';

import CurrencySelect from './CurrencySelect';

const { TextArea } = Input;

const StudentFormFields = () => {
  return (
    <>
      <Form.Item name="name" label="Name:" rules={studentFormRules.name}>
        <Input placeholder="John Snow" />
      </Form.Item>

      <Form.Item name="email" label="Email:" rules={studentFormRules.email}>
        <Input placeholder="student@mail.com" />
      </Form.Item>

      <Form.Item label="Phone:" name="phone" rules={studentFormRules.phone}>
        <Input placeholder="+380667462269" />
      </Form.Item>

      <Form.Item name="contact" label="Contact:">
        <Input placeholder="Link to insta, telegram, facebook etc..." />
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
          name="cost"
          label="Cost:"
          style={{ flex: 1 }}
          rules={studentFormRules.cost}
        >
          <InputNumber
            placeholder="500"
            min={0}
            addonAfter={<CurrencySelect />}
          />
        </Form.Item>
      </Flex>

      <Form.Item name="notes" label="Notes:">
        <TextArea rows={2} placeholder="Preparing for english exam" />
      </Form.Item>
    </>
  );
};

export default StudentFormFields;
