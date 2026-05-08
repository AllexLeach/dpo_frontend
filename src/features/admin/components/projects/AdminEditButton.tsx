import { Button, Modal } from "antd";
import { FormProject } from "./FormProject";
import { MdEdit } from "react-icons/md";
import { useState } from "react";
import type { Project } from "../../../../app/api/types";

interface AdminEditButtonProps {
   handelProject: (updateProject: Partial<Project>, isEditing?: boolean, project?: Project) => void;
}

export function AdminEditButton({ handelProject }: AdminEditButtonProps) {
   const [ hovered, setHovered ] = useState(false);
   const [ modalOpen, setModalOpen ] = useState(false);

   return(
      <>
         <div
            className='flex justify-center items-center'
            onMouseEnter={() => {
               setHovered(true);
            }}
            onMouseLeave={() => {
               setHovered(false);
            }}
            onClick={() => setModalOpen(true)}
         >
            <div
               className='transition-all duration-300 text-white translate-x-[10px] rounded-md bg-[#3d8eff]'
               style={{
                  padding: '2px 20px 4px 10px',
                  cursor: 'pointer',
                  opacity: hovered? 1: 0,
               }}
            >
               Создать проект
            </div>
            <Button
               type='primary'
               shape='circle'
               icon={<MdEdit size={25} />}
               iconPlacement='end'
               style={{ padding: 22.5 }}
            />
         </div>
         <Modal
            open={modalOpen}
            onCancel={() => setModalOpen(false)}
            footer={[]}
            destroyOnHidden
         >
            <FormProject
               handelCancel={() => setModalOpen(false)}
               handelOk={(updateProject, isEditMode) => {
                  handelProject(updateProject, isEditMode)
                  setModalOpen(false);
               }}
            />
         </Modal>
      </>
   );
}