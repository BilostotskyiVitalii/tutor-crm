import { useTranslation } from 'react-i18next';

import { UploadOutlined } from '@ant-design/icons';
import { Form, Upload } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import ImgCrop from 'antd-img-crop';

interface AvatarUploaderProps {
  fileList: UploadFile[];
  setFileList: (list: UploadFile[]) => void;
}

const AvatarUploader = ({ fileList, setFileList }: AvatarUploaderProps) => {
  const { t } = useTranslation();
  return (
    <Form.Item>
      <ImgCrop rotationSlider modalTitle={t('avatarUploader.cropTitle')}>
        <Upload
          fileList={fileList}
          customRequest={({ onSuccess }) => {
            setTimeout(() => onSuccess?.('ok'), 0);
          }}
          onChange={({ fileList }) => setFileList(fileList)}
          showUploadList={{ showPreviewIcon: false }}
          maxCount={1}
          listType="picture-card"
        >
          <div>
            <UploadOutlined />
            <div>{t('avatarUploader.uploadTitle')}</div>
          </div>
        </Upload>
      </ImgCrop>
    </Form.Item>
  );
};

export default AvatarUploader;
