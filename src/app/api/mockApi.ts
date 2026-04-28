import type { Project, Task } from "./types";

class MockApi {
   private projects: Project[];
   private tasks: Task[];

   constructor() {
      this.projects = [
         {
            id: 'proj_1',
            name: 'ЖК "Золотые купола"',
            description: 'Комплекс премиум-класса с подземным паркингом и собственной инфраструктурой. 3 корпуса переменной этажности.',
            photo_url: 'https://images.unsplash.com/photo-1545324412-cc2695a7fa8b?w=600&h=400&fit=crop',
            status: 'active',
         },
         {
            id: 'proj_2',
            name: 'БЦ "Технопарк"',
            description: 'Бизнес-центр класса А с конференц-залами, коворкингом и подземной парковкой на 500 мест.',
            photo_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop',
            status: 'active',
         },
         {
            id: 'proj_3',
            name: 'ТЦ "Мегаполис"',
            description: 'Торгово-развлекательный центр с кинотеатром, фудкортом и детской зоной. Общая площадь 45 000 м².',
            photo_url: 'https://images.unsplash.com/photo-1577412647305-991150c0d207?w=600&h=400&fit=crop',
            status: 'paused',
         },
         {
            id: 'proj_4',
            name: 'Жилой комплекс "Речной"',
            description: '4 корпуса переменной этажности, набережная, детский сад на территории. Сдан в эксплуатацию.',
            photo_url: 'https://images.unsplash.com/photo-1569001109127-678d2ee5c42c?w=600&h=400&fit=crop',
            status: 'done',
         },
         {
            id: 'proj_5',
            name: 'Складской комплекс "Логистик"',
            description: 'Склад класса А площадью 30 000 м² с ж/д веткой и автомобильными рампой.',
            photo_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=400&fit=crop',
            status: 'canceled',
         },
      ];
      this.tasks = [];
   }

   private async delay<T>(data: T, ms: number = 500): Promise<T> {
      return new Promise(resolve => setTimeout(() => resolve(data), ms));
   }

   private throwIfNotFound<T>(item: T | undefined, id: string, entity: string): T {
      if (!item) {
         throw new Error(`${entity} with id ${id} not found`);
      }
      return item;
   }

   async getProjects(): Promise<Project[]> {
      return this.delay([...this.projects]);
   }
   
   async getProject(id: string): Promise<Project> {
      const project = this.projects.find(p => p.id === id);
      this.throwIfNotFound(project, id, 'Project');
      return this.delay(project!);
   }

   async createProject(project: Omit<Project, 'id'>): Promise<Project> {
      const newProject: Project = {
         id: crypto.randomUUID(),
         ...project,
      };
      this.projects.push(newProject);
      return this.delay(newProject);
   }

   async updateProject(projectId: string, updates: Partial<Project>): Promise<Project> {
      let updatedProject: Project | undefined;
      
      this.projects = this.projects.map(project => {
         if (project.id === projectId) {
            updatedProject = { ...project, ...updates };
            return updatedProject;
         }
         return project;
      });

      this.throwIfNotFound(updatedProject, projectId, 'Project');
      return this.delay(updatedProject!);
   }
   
   async deleteProject(projectId: string): Promise<Project> {
      const index = this.projects.findIndex(p => p.id === projectId);
      if (index === -1) {
         throw new Error(`Project with id ${projectId} not found`);
      }
      
      const deletedProject = this.projects[index];
      this.projects = this.projects.filter(p => p.id !== projectId);
      
      // удалить все задачи этого проекта
      this.tasks = this.tasks.filter(t => t.project_id !== projectId);
      
      return this.delay(deletedProject);
   }

   async getTasks(projectId?: string): Promise<Task[]> {
      let tasks = [...this.tasks];
      if (projectId) {
         tasks = tasks.filter(t => t.project_id === projectId);
      }
      return this.delay(tasks);
   }

   async getTask(id: string): Promise<Task> {
      const task = this.tasks.find(t => t.id === id);
      this.throwIfNotFound(task, id, 'Task');
      return this.delay(task!);
   }
   
   async createTask(task: Omit<Task, 'id'>): Promise<Task> {
      const newTask: Task = {
         id: crypto.randomUUID(),
         ...task,
      };
      
      this.tasks.push(newTask);
      
      // автоматически добавляем id задачи в проект
      const project = this.projects.find(p => p.id === task.project_id);
      if (project && project.tasks_id) {
         project.tasks_id.push(newTask.id);
      }
      
      return this.delay(newTask);
   }
   
   async updateTask(taskId: string, updates: Partial<Task>): Promise<Task> {
      let updatedTask: Task | undefined;
      
      this.tasks = this.tasks.map(task => {
         if (task.id === taskId) {
            updatedTask = { ...task, ...updates };
            return updatedTask;
         }
         return task;
      });

      this.throwIfNotFound(updatedTask, taskId, 'Task');
      return this.delay(updatedTask!);
   }
   
   async deleteTask(taskId: string): Promise<Task> {
      const index = this.tasks.findIndex(t => t.id === taskId);
      if (index === -1) {
         throw new Error(`Task with id ${taskId} not found`);
      }
      
      const deletedTask = this.tasks[index];
      this.tasks = this.tasks.filter(t => t.id !== taskId);
      
      // удаляем id задачи из проекта
      const project = this.projects.find(p => p.id === deletedTask.project_id);
      if (project && project.tasks_id) {
         project.tasks_id = project.tasks_id.filter(id => id !== taskId);
      }
      
      return this.delay(deletedTask);
   }
}

export const api = new MockApi();