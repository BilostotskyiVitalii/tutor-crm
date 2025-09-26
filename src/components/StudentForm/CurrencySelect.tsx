import { Select } from 'antd';

const { Option } = Select;

const CurrencySelect = () => (
  <Select defaultValue="UAH">
    <Option value="UAH">UAH ₴</Option>
    <Option value="USD">USD $</Option>
    <Option value="EUR">EUR €</Option>
  </Select>
);

export default CurrencySelect;
