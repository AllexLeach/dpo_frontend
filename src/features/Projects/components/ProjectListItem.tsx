import { Button, Card, Modal } from "antd";
import type { Project } from "../../../app/api/types";
import { useNavigate } from "react-router";
import { useRole } from "../../../app/RoleContext";
import { useState } from "react";
import { FormProject } from "../../admin";
import { ImageLoading, StatusBadge } from "../../../shared";

interface ProjectListItemProps {
   project: Project;
   handelDelete: () => void;
   handelProject: (updateProject: Partial<Project>, isEditing?: boolean, project?: Project) => void;
}

export function ProjectListItem({ project, handelDelete, handelProject }: ProjectListItemProps) {
   const nav = useNavigate();
   const { isAdmin } = useRole();
   const [ modalOpen, setModalOpen ] = useState(false);

   return(
      <Card
         hoverable
         className="h-full flex flex-col transition-all duration-300 hover:shadow-xl cursor-pointer"
         styles={{ body: { flex: 1, display: 'flex', flexDirection: 'column' } }}
      >
         <div className="flex flex-col gap-5">
            <div className="flex gap-5 flex-1" onClick={() => nav(`/${project.id}`)}>
               <ImageLoading src={project.photo_url} alt={project.name} width={150} height={150}/>
               <div className="flex flex-col flex-1 min-w-0 min-h-0 gap-2 justify-between">
                  <h3 className="text-base font-semibold line-clamp-2">
                     {project.name}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-3">
                     {project.description}
                  </p>
                  <div className="flex items-center justify-between flex-wrap gap-1">
                     <StatusBadge status={project.status} />
                     <Button
                        type="link" 
                        size="small"
                        className="text-blue-500 hover:text-blue-700"
                        style={{ padding: 0 }}
                     >
                        Подробнее...
                     </Button>
                  </div>
               </div>
            </div>
            {isAdmin &&
               <div className="w-full flex gap-2 justify-between">
                  <Button
                     className="w-full"
                     danger
                     onClick={handelDelete}
                  >
                     Удалить
                  </Button>
                  <Button
                     className="w-full"
                     type="primary"
                     onClick={() => {
                        setModalOpen(true);
                     }}
                  >
                     Редактировать
                  </Button>
               </div>
            }
         </div>
         <Modal
            open={modalOpen}
            onCancel={() => setModalOpen(false)}
            footer={[]}
            destroyOnHidden
         >
            <FormProject
               project={project}
               isEditMode={true}
               handelCancel={() => setModalOpen(false)}
               handelOk={(updateProject, isEditMode) => {
                  handelProject(updateProject, isEditMode, project)
                  setModalOpen(false);
               }}
            />
         </Modal>
      </Card>
   );
}