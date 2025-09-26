import { type FC, useEffect, useState } from 'react';

import { UploadOutlined } from '@ant-design/icons';
import {
  DatePicker,
  Flex,
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

import { langLevels } from '@/constants/varaibles';
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
        phone: values.phone ?? '',
        contact: values.contact ?? '',
        birthdate: values.birthdate ? values.birthdate.valueOf() : '',
        notes: values.notes ?? '',
        status: isEditMode && editedStudent ? editedStudent.status : 'active',
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

  const selectCurrency = (
    <Select defaultValue="UAH">
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
          name="name"
          label="Name:"
          rules={[{ required: true, message: 'Enter name' }]}
        >
          <Input placeholder="John Snow" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email:"
          rules={[
            { required: true, message: 'Будь ласка, введіть email' },
            { type: 'email', message: 'Wrong email format' },
          ]}
        >
          <Input placeholder="student@mail.com" />
        </Form.Item>

        <Form.Item
          label="Phone:"
          name="phone"
          rules={[
            {
              pattern: /^\+\d{7,15}$/,
              message: 'Phone number must start with + and contain 7–15 digits',
            },
          ]}
        >
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
            rules={[{ required: true, message: 'Chose student level' }]}
          >
            <Select options={langLevels} />
          </Form.Item>

          <Form.Item
            name="cost"
            label="Cost:"
            style={{ flex: 1 }}
            rules={[{ required: true, message: 'Enter cost/hour' }]}
          >
            <InputNumber
              placeholder="500"
              min={0}
              addonAfter={selectCurrency}
            />
          </Form.Item>
        </Flex>

        <Form.Item>
          <ImgCrop rotationSlider modalTitle="Crop your avatar">
            <Upload
              fileList={fileList}
              customRequest={({ onSuccess }) => {
                setTimeout(() => {
                  onSuccess?.('ok');
                }, 0);
              }}
              onChange={({ fileList }) => setFileList(fileList)}
              showUploadList={{ showPreviewIcon: false }}
              maxCount={1}
              listType="picture-card"
            >
              <div>
                <UploadOutlined />
                <div>Upload avatar</div>
              </div>
            </Upload>
          </ImgCrop>
        </Form.Item>

        <Form.Item name="notes" label="Notes:">
          <TextArea rows={2} placeholder="Preparing for english exam" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default StudentForm;
