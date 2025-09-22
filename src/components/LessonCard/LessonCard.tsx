import type { Lesson } from '@/types/lessonTypes';
import { Button } from 'antd';
import type { FC } from 'react';

interface LessonCardProps {
  lesson: Lesson;
  onEdit: (lesson: Lesson) => void;
}

const LessonCard: FC<LessonCardProps> = ({ lesson, onEdit }) => {
  return (
    <div key={lesson.id} style={{ border: '1px solid' }}>
      <h2>{lesson.studentIds}</h2>
      <div>{lesson.notes}</div>
      <div>{`Start: ${lesson.start}`}</div>
      <div>{`End: ${lesson.end}`}</div>
      <Button onClick={() => onEdit(lesson)}>Update</Button>
    </div>
  );
};

export default LessonCard;
