import { db } from "../db/database";
import type { Project, Task } from "./types";


class IndexedDbApi {
   
   async getProjects(): Promise<Project[]> {
      return await db.projects.toArray();
   }

   async getProject(id: string): Promise<Project> {
      const project = await db.projects.get(id);
      if (!project) throw new Error(`Project ${id} not found`);
      return project;
   }

   async createProject(project: Omit<Project, 'id'>): Promise<Project> {
      const id = crypto.randomUUID();
      const newProject = { ...project, id };
      await db.projects.add(newProject);
      return newProject;
   }

   async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
      await db.projects.update(id, updates);
      const updated = await db.projects.get(id);
      if (!updated) throw new Error(`Project ${id} not found after update`);
      return updated;
   }

   async deleteProject(id: string): Promise<Project> {
      const deletedProject = await db.projects.get(id);
      if (!deletedProject) {
         throw new Error(`Project with id ${id} not found`);
      }
      
      await db.projects.delete(id);
      // Каскадно удаляем задачи
      await db.tasks.where('project_id').equals(id).delete();
      
      return deletedProject;
   }

   // ========== TASKS ==========
   async getTasks(projectId?: string): Promise<Task[]> {
      if (projectId) {
         // сортировка по startDate на стороне "бэка"
         return await db.tasks.where('project_id').equals(projectId).sortBy('startDate');
      }
      return await db.tasks.toArray();
   }

   async getTask(id: string): Promise<Task> {
      const task = await db.tasks.get(id);
      if (!task) throw new Error(`Task ${id} not found`);
      return task;
   }

   async createTask(task: Omit<Task, 'id'>): Promise<Task> {
      const id = crypto.randomUUID();
      const newTask = { ...task, id };
      await db.tasks.add(newTask);
      return newTask;
   }

   async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
      await db.tasks.update(id, updates);
      const updated = await db.tasks.get(id);
      if (!updated) throw new Error(`Task ${id} not found after update`);
      return updated;
   }

   async deleteTask(id: string): Promise<Task> {
      return await db.transaction('rw', db.tasks, async () => {
         const deletedTask = await db.tasks.get(id);
         if (!deletedTask) {
            throw new Error(`Task with id ${id} not found`);
         }
         
         await db.tasks.delete(id);
         return deletedTask;
      });
   }
}

export const api = new IndexedDbApi();