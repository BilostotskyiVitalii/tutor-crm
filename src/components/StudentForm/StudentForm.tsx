import { type FC, useEffect, useState } from 'react';

import { UploadOutlined } from '@ant-design/icons';
import {
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
  Select,
} from 'antd';
import { Upload } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import ImgCrop from 'antd-img-crop';
import dayjs from 'dayjs';

import {
  useAddStudentMutation,
  useUpdateStudentMutation,
} from '@/store/studentsApi';
import type {
  Student,
  StudentData,
  StudentFormValues,
} from '@/types/studentTypes';
import { uploadAvatar } from '@/utils/uploadAvatar';

const { Option } = Select;
const { TextArea } = Input;

interface StudentFormProps {
  isModalOpen: boolean;
  onClose: () => void;
  isEditMode: boolean;
  editedStudent?: Student | null;
}

const StudentForm: FC<StudentFormProps> = ({
  onClose,
  isModalOpen,
  isEditMode,
  editedStudent,
}) => {
  const [form] = Form.useForm<StudentFormValues>();
  const [addStudent] = useAddStudentMutation();
  const [updateStudent] = useUpdateStudentMutation();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (isModalOpen) {
      if (isEditMode && editedStudent) {
        form.setFieldsValue({
          ...editedStudent,
          birthdate: editedStudent.birthdate
            ? dayjs(editedStudent.birthdate)
            : null,
        });
      } else {
        form.resetFields();
      }
    }
  }, [isModalOpen, isEditMode, editedStudent, form]);

  const handleCancel = () => {
    onClose();
    form.resetFields();
  };

  const handleOk = async () => {
    try {
      const values: StudentFormValues = await form.validateFields();
      const normalizeValues: StudentData = {
        ...values,
        birthdate: values.birthdate ? values.birthdate.valueOf() : '',
        notes: values.notes ?? '',
      };

      let avatarUrl: string | undefined;

      if (fileList.length > 0) {
        const file = fileList[0].originFileObj as File;
        const studentId =
          isEditMode && editedStudent ? editedStudent.id : crypto.randomUUID();
        avatarUrl = await uploadAvatar(
          file,
          studentId,
          editedStudent?.avatarUrl,
        );
        normalizeValues.avatarUrl = avatarUrl;
      }

      if (isEditMode && editedStudent) {
        await updateStudent({
          id: editedStudent.id,
          data: normalizeValues,
        }).unwrap();
        notification.success({ message: 'Student updated!' });
      } else {
        await addStudent(normalizeValues).unwrap();
        notification.success({ message: 'Student created!' });
      }

      onClose();
      form.resetFields();
      setFileList([]);
    } catch {
      notification.error({ message: 'Student form error!' });
    }
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as File);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const selectCurrency = (
    <Select defaultValue="UAH" style={{ width: 100 }}>
      <Option value="UAH">UAH ₴</Option>
      <Option value="USD">USD $</Option>
      <Option value="EUR">EUR €</Option>
    </Select>
  );

  return (
    <Modal
      title={isEditMode ? 'Update student' : 'New student'}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={isEditMode ? 'Update' : 'Create'}
      cancelText="Cancel"
    >
      <Form form={form} layout="vertical" name="student_form">
        <Form.Item
          label="Name:"
          name="name"
          rules={[{ required: true, message: 'Enter name' }]}
        >
          <Input placeholder="John Snow" />
        </Form.Item>

        <Form.Item
          label="Email:"
          name="email"
          rules={[
            { required: true, message: 'Enter email' },
            { type: 'email', message: 'Wrong email format' },
          ]}
        >
          <Input placeholder="john@mail.com" />
        </Form.Item>

        <Form.Item label="Birthdate:" name="birthdate">
          <DatePicker format="DD.MM.YYYY" />
        </Form.Item>

        <Form.Item
          label="Cost/hour:"
          name="cost"
          rules={[{ required: true, message: 'Enter cost/hour' }]}
        >
          <InputNumber placeholder="500" min={0} addonAfter={selectCurrency} />
        </Form.Item>

        <Form.Item label="Avatar:">
          <ImgCrop rotationSlider modalTitle="Crop your avatar">
            <Upload
              fileList={fileList}
              customRequest={({ onSuccess }) => {
                setTimeout(() => {
                  onSuccess?.('ok');
                }, 0);
              }}
              onChange={({ fileList }) => setFileList(fileList)}
              onPreview={onPreview}
              maxCount={1}
              listType="picture-card"
            >
              <div>
                <UploadOutlined />
                <div>Upload</div>
              </div>
            </Upload>
          </ImgCrop>
        </Form.Item>

        <Form.Item label="Notes:" name="notes">
          <TextArea rows={3} placeholder="Note some info here" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default StudentForm;
