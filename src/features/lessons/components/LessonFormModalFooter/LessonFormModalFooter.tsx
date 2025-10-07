import type { FC } from 'react';

import { Button } from 'antd';

interface LessonFormModalFooterProps {
  editedLessonId?: number | string | null;
  isLoading: boolean;
  onDelete?: () => void;
  onCancel: () => void;
  onSubmit: () => void;
}

const LessonFormModalFooter: FC<LessonFormModalFooterProps> = ({
  editedLessonId,
  isLoading,
  onDelete,
  onCancel,
  onSubmit,
}) => {
  return (
    <>
      {editedLessonId && (
        <Button danger onClick={onDelete}>
          Delete
        </Button>
      )}
      <Button onClick={onCancel}>Cancel</Button>
      <Button type="primary" loading={isLoading} onClick={onSubmit}>
        {editedLessonId ? 'Update' : 'Create'}
      </Button>
    </>
  );
};

export default LessonFormModalFooter;
