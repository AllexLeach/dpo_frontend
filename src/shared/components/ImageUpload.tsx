import { Button, Image, Upload, type GetProp, type UploadFile, type UploadProps } from "antd";
import { useEffect, useState } from "react";

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

interface InputFileProps {
  file: File | null;
  setIconFile: (file: File | null) => void;
}

function getBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

export function InputFile({ file, setIconFile }: InputFileProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (file) {
      const fileObj = Object.assign(file, {uid: `new-file-${file.name.split('_').shift()}`}) as FileType;

      setFileList([
        {
          uid: `new-file-${file.name.split('_').shift()}`,
          name: file.name,
          status: 'done',
          originFileObj: fileObj
        }
      ]);
    } else setFileList([]);
  }, [file]);

  
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as File);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    const newFile = newFileList[newFileList.length-1];
    setFileList(newFile? [{
      uid: newFile.uid,
      name: newFile.name,
      status: 'done',
      originFileObj: newFile.originFileObj
    }]: []);
    setIconFile(newFile? newFile.originFileObj as File: null);
  }

  const handelRemove: UploadProps['onRemove'] = () => {
    setFileList([]);
    setIconFile(null);
  }

  return (
    <>
      <Upload
        prefixCls='w-full'
        customRequest={() => {}} // пустая функция для отмены отправки на сервер по дефолту
        listType="picture"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        onRemove={handelRemove}
        accept="image/*"
      >
        <Button className='w-full' style={{ paddingLeft: 10, }}>
          <span className='w-full flex align-start'>
            {fileList.length? 'Изменить фото': 'Добавить фото'}
          </span>
        </Button>
      </Upload>
      {previewImage && (
        <Image
          wrapperStyle={{ display: 'none' }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
          }}
          src={previewImage}
        />
      )}
    </>
  );
};