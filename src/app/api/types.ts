export type TaskStatus = 'wait' | 'process' | 'finish' | 'error';

export interface Task {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: TaskStatus;
  project_id: string;
}

export type ProjectStatus = 'active' | 'done' | 'paused' | 'canceled';

export interface Project {
  id: string;
  name: string;
  description: string;
  photo_url: string;
  status: ProjectStatus;
}