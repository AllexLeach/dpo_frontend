export interface Task {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'waiting' | 'process' | 'finish' | 'error';
  project_id: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  photo_url: string;
  status: 'active' | 'done' | 'paused' | 'canceled';
  tasks_id?: string[]; // сделал опциональным, можно вообще убрать. может приготится прирасширении?
}