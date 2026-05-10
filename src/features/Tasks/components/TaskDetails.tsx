import { Button, Descriptions, Input, Select } from "antd";
import type { Task } from "../../../app/api/types";
import StatusBadge from "../../../app/shared/StatusBadge";
import { useEffect, useState } from "react";
import { DatePickerWithStatus } from "../../admin";
import type { InputStatus } from "antd/es/_util/statusUtils";

interface TaskDetailsProps {
   task: Task;
   isEditing: boolean;
   handelOk: (updateProject: Partial<Task>, isEditMode?: boolean) => void;
   handelCancel: () => void;
}

type FormDataTask = Omit<Task, 'id'>;

interface Status {
   status: InputStatus;
   popover: boolean;
   errText: string;
}

interface DateStatus {
   start: Status;
   end: Status;
}

const defaultDateStatus: DateStatus = {
   start: {
      status: '',
      popover: false,
      errText: ''
   },
   end: {
      status: '',
      popover: false,
      errText: ''
   }
}

export function TaskDetails({ task, isEditing, handelOk, handelCancel }: TaskDetailsProps) {
   const [ formData, setFormData ] = useState<FormDataTask>({} as FormDataTask);
   const [ dateStatus, setDateStatus ] = useState<DateStatus>(defaultDateStatus);
   
   const errorMessage = 'Дата начала задачи должны быть меньше его окончания';

   useEffect(() => {
      if (task) {
         setFormData(task);
         setDateStatus(defaultDateStatus);
      }
   }, [isEditing]);
   
   return(
      <div className="bg-gray-50 rounded-lg" >
         <Descriptions column={1} bordered>
            <Descriptions.Item label="Задача">
               {!isEditing?
                  task.name
               :
                  <Input
                     type="text"
                     value={formData.name}
                     onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
               }
            </Descriptions.Item>
            <Descriptions.Item label="Описание">
               {!isEditing?
                  task.description
               :
                  <Input
                     type="text"
                     value={formData.description}
                     onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
               }
            </Descriptions.Item>
            <Descriptions.Item label="Сроки">
               {!isEditing?
                  <span>{task.startDate} - {task.endDate}</span>
               :
                  <div className={`flex ${document.body.clientWidth <= 840 && 'flex-col'} gap-2`}>
                     <div>
                        <DatePickerWithStatus
                           value={formData.startDate}
                           status={dateStatus.start.status}
                           onClick={() => {
                              setDateStatus({
                                 ...dateStatus,
                                 start: {
                                       ...dateStatus.start,
                                       popover: false
                                 },
                              })
                           }}
                           onChange={(dateStr) => {
                              const start = new Date(dateStr as string).getTime();
                              const end = new Date(formData.endDate).getTime();
                              if (start>=end) {
                                 setDateStatus({
                                       start: {
                                          ...dateStatus.start,
                                          status: 'warning',
                                          errText: errorMessage
                                       },
                                       end: {
                                          ...dateStatus.end,
                                          status: '',
                                          popover: false
                                       }
                                 });
                              } else {
                                 setDateStatus({
                                       start: {
                                          ...dateStatus.start,
                                          status: '',
                                          popover: false
                                       },
                                       end: {
                                          ...dateStatus.end,
                                          status: '',
                                          popover: false
                                       }
                                 })
                              }
                              setFormData({...formData, startDate: dateStr});
                           }}
                           popoverProps={{
                              content: <div>{dateStatus.start.errText}</div>,
                              title: "Ошибка",
                              trigger: "hover",
                              placement: "bottomRight",
                              open: document.body.clientWidth <= 840? false: dateStatus.start.popover,
                              onOpenChange: (e) => {
                                 if (dateStatus.start.status) {
                                       setDateStatus({...dateStatus, start: {
                                          ...dateStatus.start,
                                          popover: e
                                       }});
                                 }
                              }
                           }}
                        />
                     </div>
                     <span>-</span>
                     <div>
                        <DatePickerWithStatus
                           value={formData.endDate}
                           status={dateStatus.end.status}
                           onClick={() => {
                              setDateStatus({
                                 ...dateStatus,
                                 end: {
                                       ...dateStatus.end,
                                       popover: false
                                 },
                              })
                           }}
                           onChange={(dateStr) => {
                              const start = new Date(formData.startDate).getTime();
                              const end = new Date(dateStr as string).getTime();
                              if (start>=end) {
                                 setDateStatus({
                                       start: {
                                          ...dateStatus.start,
                                          status: '',
                                          popover: false
                                       },
                                       end: {
                                          ...dateStatus.end,
                                          status: 'warning',
                                          errText: errorMessage
                                       }
                                 });
                              } else {
                                 setDateStatus({
                                       start: {
                                          ...dateStatus.start,
                                          status: '',
                                          popover: false
                                       },
                                       end: {
                                          ...dateStatus.end,
                                          status: '',
                                          popover: false
                                       }
                                 })
                              }
                              setFormData({...formData, endDate: dateStr});
                           }}
                           popoverProps={{
                              content: <div>{dateStatus.end.errText}</div>,
                              title: "Ошибка",
                              trigger: "hover",
                              placement: "bottomRight",
                              open: document.body.clientWidth <= 840? false: dateStatus.end.popover,
                              onOpenChange: (e) => {
                                 if (dateStatus.end.status) {
                                       setDateStatus({...dateStatus, end: {
                                          ...dateStatus.end,
                                          popover: e
                                       }});
                                 }
                              }
                           }}
                        />
                     </div>
                  </div>
               }
            </Descriptions.Item>
            <Descriptions.Item label="Статус">
               {!isEditing?
                  <StatusBadge
                     status={task.status}
                     config={{
                        wait: { bg: '#FFF7E6', text: 'Заморожен', color: '#e3aa00' },
                        process: { bg: '#E6F4FF', text: 'В процессе', color: '#1677FF' },
                        finish: { bg: '#E6FFE6', text: 'Готово', color: '#00cd12' },
                        error: { bg: '#FFE6E6', text: 'Не выполнено', color: '#cd0000' },
                     }}
                  />
               :
                  <Select
                     value={formData.status}
                     onChange={(value) => setFormData({ ...formData, status: value })}
                     options={[
                        { value: 'process', label: 'В процессе'},
                        { value: 'done', label: 'Готово'},
                        { value: 'wait', label: 'Заморожен'},
                        { value: 'error', label: 'Не выполнено'},
                     ]}
                  />
               }
            </Descriptions.Item>
         </Descriptions>
         {isEditing &&
            <div className="w-full flex gap-2 md:gap-5 justify-between" style={{ paddingTop: 10 }}>
               <Button
                  className="w-full"
                  onClick={handelCancel}
               >
                  Отменить
               </Button>
               <Button
                  className="w-full"
                  type="primary"
                  onClick={() => {
                     if ((new Date(formData.startDate).getTime())>(new Date(formData.endDate).getTime())) {
                        setDateStatus({
                           start: {
                              status: 'error',
                              popover: true,
                              errText: errorMessage,
                           },
                           end: {
                              status: 'error',
                              popover: false,
                              errText: errorMessage,
                           }
                        });
                     } else {
                        handelOk(formData, true);
                     }
                  }}
               >
                  Подтвердить
               </Button>
            </div>
         }
      </div>
   );
}