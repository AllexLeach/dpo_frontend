import { useEffect, useState } from "react";
import type { Project, Task } from "../../../app/api/types";
import { api } from "../../../app/api/indexedDbApi";
import { Button, Card, Empty, message, Modal, Spin, type StepsProps } from "antd";
import { TaskDetails } from "./TaskDetails";
import { PaginationSteps } from "./PaginationSteps";
import { useRole } from "../../../app/RoleContext";
import { FormTask } from "../../admin";

interface TaskLineProps {
   project: Project
}

export function TaskLine({ project }: TaskLineProps) {
   const [ tasks, setTasks ] = useState<Task[]>([]);
   const [ currentTaskIndex, setCurrentTaskIndex ] = useState(0);
   const [ isLoading, setIsLoading ] = useState(true);
   const { isAdmin } = useRole();
   const [ modalOpen, setModalOpen ] = useState(false);
   const [ isEditing, setEditing ] = useState(false);

   useEffect(() => {
      (async () => {
         try {
            const res = await api.getTasks(project.id);   
            setTasks(res);
         } catch(e) {
            console.error(e)
         } finally {
            setIsLoading(false);
         }
      })();
   }, []);

   useEffect(() => {
      if (project.status === 'done') {
         setCurrentTaskIndex(tasks.length && tasks.length- 1);
      } else {
         tasks.map((task, index) => {
            if (
               task.status === 'process'
               || task.status === 'error'
            ) {
               setCurrentTaskIndex(prev => prev === 0? index: prev);
            }
         })
      }
   }, [tasks]);

   const items: StepsProps['items'] = tasks.map((task, index) => {
      return {
         title: task.name,
         content: `${task.startDate} - ${task.endDate}`,
         status: task.status,
         icon: index+1
      };
   });

   return(
      <Card>
         {isLoading ?
            <div className='w-full min-h-[500px] flex flex-col justify-center items-center gap-5' style={{ padding: 10 }}>
               <Spin size="large" />
            </div>
         :
            <div className="flex flex-col gap-5">
               {tasks.length? (<>
                  <PaginationSteps
                     items={[...items]}
                     currentTaskIndex={currentTaskIndex}
                     setCurrentTaskIndex={(e) => {
                        setCurrentTaskIndex(e);
                        setEditing(false);
                     }}
                  />
                  <div>
                     <TaskDetails
                        task={tasks[currentTaskIndex]}
                        isEditing={isEditing}
                        handelCancel={() => setEditing(false)}
                        handelOk={(updateTask, isEditMode) => {
                           handelTask(updateTask, isEditMode, tasks[currentTaskIndex]);
                           setEditing(false);
                        }}
                     />
                  </div>
               </>)
               : (
                  <div className='w-full flex flex-col justify-center items-center gap-5' style={{ paddingTop: 5 }}>
                     <span className='text-gray-700'>Задач ещё нет...</span>
                     <Empty />
                  </div>
               )}
               {isAdmin?
                  isEditing? null:
                  <div className="w-full flex flex-col gap-2">
                     <div className="w-full flex gap-2 md:gap-5 justify-between">
                        <Button
                           className="w-full"
                           danger
                           onClick={() => handelDelete(tasks[currentTaskIndex])}
                        >
                           Удалить
                        </Button>
                        <Button
                           className="w-full"
                           type="primary"
                           onClick={() => {
                              setEditing(true);
                           }}
                        >
                           Редактировать
                        </Button>
                     </div>
                     <div className="w-full flex gap-2 md:gap-5 justify-between">
                        <Button
                           className="w-full"
                           type="primary"
                           onClick={() => {
                              setModalOpen(true);
                           }}
                        >
                           Создать задачу
                        </Button>
                        <Modal
                           open={modalOpen}
                           onCancel={() => setModalOpen(false)}
                           footer={[]}
                           destroyOnHidden
                        >
                           <FormTask
                              project_id={project.id}
                              handelCancel={() => setModalOpen(false)}
                              handelOk={(updateTask, isEditMode) => {
                                 handelTask(updateTask, isEditMode, tasks[currentTaskIndex])
                                 setModalOpen(false);
                              }}
                           />
                        </Modal>
                     </div>
                  </div>
               : null}
            </div>
         }
      </Card>
   );

   async function handelTask(updateTask: Partial<Task>, isEditMode:boolean = false, task?: Task) {
      try { 
         if (isEditMode) {
            if (task) {
               const updTask = await api.updateTask(task.id, updateTask);
               message.success(`Задача "${updTask.name}" успешно изменена`);
            }
         } else {
            const payload = {...updateTask} as Omit<Task, 'id'>;
            const newTask = await api.createTask(payload);
            message.success(`Задача "${newTask.name}" успешно создана`);
         }
         // обновлённый отсортированый массив тасок
         const res = await api.getTasks(project.id);   
         setTasks(res);
         setCurrentTaskIndex(isEditMode? currentTaskIndex: 0);
      } catch(error) {
         console.error(error);
         message.error(`Ошибка при ${isEditMode? 'редактировании': 'создании'}`);
      }
   }

   async function handelDelete(task: Task) {
      try {
         const confirm = window.confirm(`Удалить задачу "${task.name}"`);

         if (!confirm) return;
         
         const deleteTusk = await api.deleteTask(task.id);
         message.success(`Задача "${deleteTusk.name}" успешно удалёна`);

         const res = await api.getTasks(project.id);
         setTasks(res);
         setCurrentTaskIndex(currentTaskIndex === 0? 0: currentTaskIndex-1);
      } catch(err) {
         console.error(err);
         message.error('Ошибка при удалении');
      }
   }
}