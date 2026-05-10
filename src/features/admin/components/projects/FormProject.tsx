import { Button, Form, Input, Select, Spin } from "antd";
import { useEffect, useState } from "react";
import type { Project } from "../../../../app/api/types";
import { base64ToFile, urlToFile } from "../../../../app/utils";
import { InputFile } from "../../../../shared";

type FormDataProject = Omit<Omit<Project, 'id'>, 'photo_url'> & { icon: File | null };

const defaultFormData: FormDataProject = {
   name: '',
   description: '',
   icon: null,
   status: 'active',
}

interface FormProjectProps {
   project?: Project;
   isEditMode?: boolean;
   handelCancel: () => void;
   handelOk: (updateProject: Omit<Project, 'id'>, isEditMode?: boolean) => void;
}

export function FormProject({ project, isEditMode = false, handelCancel, handelOk }: FormProjectProps) {
   const [ formData, setFormData ] = useState<FormDataProject>(defaultFormData);
   const [ loading, setLoading ] = useState(false);

   useEffect(() => {
      (async function() {
         if (project) {
            setLoading(true);
            let icon: File | null = null;
            
            if (project.photo_url) {
               if (project.photo_url.startsWith('data:')) {
                  icon = await base64ToFile(project.photo_url, project.name);
               } else if (project.photo_url.startsWith('http')) {
                  icon = await urlToFile(project.photo_url, project.name);
               }
            }

            setFormData({
               name: project.name,
               description: project.description,
               status: project.status,
               icon: icon
            });
            setLoading(false);
         } else {
            setFormData(defaultFormData);
         }
      })();
   }, [project]);

   return(
      <>
         {loading?
            <Spin size="medium" />
         :
            <Form style={{ paddingTop: 10 }}>
               <Form.Item className="w-full flex flex-col gap-1">
                  <span>Название</span>
                  <Input
                     type="text"
                     value={formData.name}
                     onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
               </Form.Item>
               <Form.Item className="w-full flex flex-col gap-1">
                  <span>Описание</span>
                  <Input
                     value={formData.description}
                     onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
               </Form.Item>
               <Form.Item className="w-full flex flex-col gap-1">
                  <span>Статус</span>
                  <Select
                     value={formData.status}
                     onChange={(value) => setFormData({ ...formData, status: value })}
                     options={[
                        { value: 'active', label: 'Активный'},
                        { value: 'done', label: 'Завершён'},
                        { value: 'paused', label: 'Приостановлен'},
                        { value: 'canceled', label: 'Отменён'},
                     ]}
                  />
               </Form.Item>
               <Form.Item className="w-full flex flex-col gap-1">
                  <span>Фото</span>
                  <div className='w-full'>
                     <InputFile file={formData.icon} setIconFile={(file) => setFormData({...formData, icon: file})}/>
                  </div>
               </Form.Item>
            </Form>
         }
         <div className="flex justify-end gap-2">
            <Button
               onClick={() => {
                  handelCancel();
                  setFormData(defaultFormData);
               }}
            >
               Отмена
            </Button>
            <Button
               type="primary"
               onClick={() => {
                  if (formData.icon) {
                     const reader = new FileReader();
                     reader.onloadend = () => {
                        const base64 = reader.result as string;
                        handelOk({...formData, photo_url: base64}, isEditMode);
                     };
                     reader.readAsDataURL(formData.icon);
                  } else {
                     handelOk({...formData, photo_url: ''}, isEditMode);
                  }
                  setFormData(defaultFormData);
               }}
               disabled={!(!!formData.name && !!formData.description) && loading}
            >
               {isEditMode? 'Подтвердить': 'Создать'}
            </Button>
         </div>
      </>
   );
}