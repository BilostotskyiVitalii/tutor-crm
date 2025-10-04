import type { FC } from 'react';

import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Form, type FormInstance, Select, Switch } from 'antd';

import { useGetGroupsQuery } from '@/features/groups/api/groupsApi';
import type { LessonFormValues } from '@/features/lessons/types/lessonTypes';

type LessonFormGroupSelectProps = {
  isGroup: boolean;
  setIsGroup: (checked: boolean) => void;
  form: FormInstance<LessonFormValues>;
};

const LessonFormGroupSelect: FC<LessonFormGroupSelectProps> = ({
  isGroup,
  setIsGroup,
  form,
}) => {
  const { data: groups = [] } = useGetGroupsQuery();

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
  );
};

export default LessonFormGroupSelect;
