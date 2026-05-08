import Dexie, { type Table } from 'dexie';
import type { Project, Task } from '../api/types';

class ConstructionDatabase extends Dexie {
   projects!: Table<Project>;
   tasks!: Table<Task>;

   constructor() {
      super('ConstructionDB');
      this.version(1).stores({
         projects: 'id, status, name',
         tasks: 'id, project_id, status, startDate',
      });
   }
}

export const db = new ConstructionDatabase();