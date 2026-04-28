import { Card } from "antd";
import type { Project } from "../../../app/api/types";

interface ProjectListItemProps {
   project: Project;
}

export function ProjectListItem({ project }: ProjectListItemProps) {
   return(
      <Card>
         {project.name}
      </Card>
   );
}