import { useEffect, useMemo, useState } from "react";
import { api } from "../../../app/api/indexedDbApi";
import type { Project } from "../../../app/api/types";
import { ProjectListItem } from "./ProjectListItem";
import { Empty, message, Spin } from "antd";
import { useRole } from "../../../app/RoleContext";
import { AdminEditButton } from "../../admin";

export function ProjectList() {
   const [ projects, setProjects ] = useState<Project[]>([]);
   const { isAdmin } = useRole();
   const [ isLoading, setIsLoading ] = useState(true);

   useEffect(() => {
      (async () => {
         try {
            const res = await api.getProjects();
            setProjects(res);
         } catch(e) {
            console.error(e);
         } finally {
            setIsLoading(false);
         }
      })();
   }, []);

   const ProjectsCard = useMemo(() => {
      return projects.map((project, key) => {
         return <ProjectListItem
            key={key}
            project={project}
            handelDelete={() => handelDelete(project)}
            handelProject={handelProject}
         />
      });
   }, [projects]);

   return(
      <div className="h-auto overflow-hidden w-full" style={{ padding: 20 }}>
         {!isLoading?
            projects.length?
               <div className="box-border grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
                  {ProjectsCard}
               </div>
            :
               <div className='w-full flex flex-col justify-center items-center gap-5' style={{ paddingTop: 5 }}>
                  <span className='text-gray-700'>Ничего не найдено...</span>
                  <Empty />
               </div>
         :
            <div className='w-full flex flex-col justify-center items-center gap-5' style={{ paddingTop: 5, height: document.body.clientHeight }}>
               <Spin size="large" />
            </div>
         }
         {isAdmin &&
            <div className='fixed z-100 bottom-5 right-5'>
               <AdminEditButton handelProject={handelProject}/>
            </div>
         }
      </div>
   );

   async function handelProject(updateProject: Partial<Project>, isEditing: boolean = false, project?: Project,) {
      try { 
         if (isEditing) {
            if (project) {
               const res = await api.updateProject(project.id, updateProject);
               message.success(`Проект "${res.name}" успешно изменён`);
               setProjects(projects.map(p => p.id === res.id? res: p));
            }
         } else {
            const payload = {...updateProject} as Omit<Project, 'id'>;
            const res = await api.createProject(payload);
            message.success(`Проект "${res.name}" успешно создан`);
            setProjects([...projects, res]);
         }         
      } catch(error) {
         console.error(error);
         message.error(`Ошибка при ${isEditing? 'редактировании': 'создании'}`);
      }
   }

   async function handelDelete(project: Project) {
      try {
         const confirm = window.confirm(`Удалить рабочее место ${project.name}`);

         if (!confirm) return;
         
         const res = await api.deleteProject(project.id);
         message.success(`Проект "${res.name}" успешно удалён`);
         
         setProjects(projects.filter(p => p.id !== res.id));
      } catch(error) {
         console.error(error);
         message.error('Ошибка при удалении');
      }
   }
}