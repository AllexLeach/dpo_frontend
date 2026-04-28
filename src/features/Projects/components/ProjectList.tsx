import { useEffect, useMemo, useState } from "react";
import { api } from "../../../app/api/mockApi";
import type { Project } from "../../../app/api/types";
import { ProjectListItem } from "./ProjectListItem";
import { Empty } from "antd";

export function ProjectList() {
   const [projects, setProjects] = useState<Project[]>([])

   useEffect(() => {
      (async () => {
         const res = await api.getProjects();
         setProjects(res);
      })();
   }, []);

   const ProjectsCard = useMemo(() => {
      return projects.map((project) => {
         return <ProjectListItem project={project} />
      });
   }, [projects]);

   return(
      <div className="h-auto overflow-hidden w-full" style={{ padding: 20 }}>
         {projects.length?
            <div className="box-border grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
               {ProjectsCard}
            </div>
         :
            <div className='w-full flex flex-col justify-center items-center gap-5' style={{ paddingTop: 5 }}>
               <span className='text-gray-700'>Ничего не найдено...</span>
               <Empty />
            </div>
         }
      </div>
   );
}