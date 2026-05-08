import { Button, Card, Empty, message, Modal, Spin } from "antd";
import { useEffect, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate, useParams } from "react-router";
import type { Project } from "../../../app/api/types";
import { api } from "../../../app/api/indexedDbApi";
import ImageLoading from "../../../app/shared/ImageLoding";
import { Tasks } from "../../Tasks";
import StatusBadge from "../../../app/shared/StatusBadge";
import { useRole } from "../../../app/RoleContext";
import { FormProject } from "../../admin";

export function Project() {
   const nav = useNavigate();
   const { projectId } = useParams();
   const [ project, setProject ] = useState<Project>();
   const [ isLoading, setIsLoading ] = useState(true);
   const { isAdmin } = useRole();
   const [ modalOpen, setModalOpen ] = useState(false);

   useEffect(() => {
      if (projectId) {
         (async () => {
            try {
               const res = await api.getProject(projectId);
               setProject(res);
            } catch(e) {
               console.error(e);
            } finally {
               setIsLoading(false);
            }
         })();
      }
   }, []);

   return(
      <div className="w-full h-full flex flex-col gap-5" style={{ padding: 20 }}>
         <Card>
            <Button
               icon={<BiArrowBack />}
               type="default"
               onClick={() => nav('/')}
            >
               Назад
            </Button>
            {!isLoading?
               project?
                  <div className="flex flex-col gap-5">
                     <div className={`w-full h-full flex ${document.body.clientWidth <= 840? 'flex-col': ''} gap-5 justify-between flex-1`}>
                        <div className="h-full flex flex-col gap-2" style={{ padding: '10px 5px 0' }}>
                           <h3 className="text-lg font-semibold">
                              {project.name}
                           </h3>
                           <p className="text-base">
                              {project.description}
                           </p>
                           <div className="flex">
                              <StatusBadge status={project.status} />
                           </div>
                        </div>
                        {project.photo_url &&
                           <div className={document.body.clientWidth <= 840? "w-full h-[400px]": "max-w-[40%] max-h-[400px] min-w-[300px] min-h-[300px]"}>
                              <ImageLoading src={project.photo_url} alt={project.name} height="100%" />
                           </div>
                        }
                     </div>
                     <div>
                        {isAdmin &&
                           <div className="w-full flex gap-2 md:gap-5 justify-between">
                              <Button
                                 className="w-full"
                                 danger
                                 onClick={() => handelDelete(project)}
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
                                    handelOk={(updateProject, isEditing) => {
                                       handelProject(updateProject, isEditing, project)
                                       setModalOpen(false);
                                    }}
                                 />
                              </Modal>
                           </div>
                        }
                     </div>
                  </div>
               :
               <div className='w-full flex flex-col justify-center items-center gap-5' style={{ paddingTop: 5 }}>
                  <span className='text-gray-700'>Ничего не найдено...</span>
                  <Empty />
               </div>
            :
               <div className='w-full min-h-[500px] flex flex-col justify-center items-center gap-5' style={{ padding: 10 }}>
                  <Spin size="large" />
               </div>
            }
         </Card>
         {project && <Tasks project={project} />}
      </div>
   );

   async function handelProject(updateProject: Partial<Project>, isEditing: boolean = false, project?: Project,) {
      try {
         if (project) {
            const res = await api.updateProject(project.id, updateProject)
            message.success(`Проект "${res.name}" успешно изменён`);
            setProject(res);
         }
      } catch(error) {
         console.error(error);
         message.error(`Ошибка при ${isEditing? 'редактировании': 'создании'}`);
      }
   }

   async function handelDelete(project: Project) {
      try {
         const confirm = window.confirm(`Удалить проект "${project.name}"`);

         if (!confirm) return;
         
         const res = await api.deleteProject(project.id);
         message.success(`Проект "${res.name}" успешно удалён`);

         nav('/');
      } catch(error) {
         console.error(error);
         message.error('Ошибка при удалении');
      }
   }
}