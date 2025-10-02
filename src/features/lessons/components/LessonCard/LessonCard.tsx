import type { FC } from 'react';

import { Button } from 'antd';

import type { Lesson } from '@/features/lessons/types/lessonTypes';

interface LessonCardProps {
  lesson: Lesson;
  onEdit: (lessonId: string) => void;
}

const LessonCard: FC<LessonCardProps> = ({ lesson, onEdit }) => {
  return (
    <div key={lesson.id} style={{ border: '1px solid' }}>
      <h2>{lesson.studentIds}</h2>
      <div>{lesson.notes}</div>
      <div>{`Start: ${lesson.start}`}</div>
      <div>{`End: ${lesson.end}`}</div>
      <Button onClick={() => onEdit(lesson.id)}>Update</Button>
    </div>
  );
};

export default LessonCard;
