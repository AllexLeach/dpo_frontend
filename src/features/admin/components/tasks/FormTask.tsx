import { Button, Form, Input, Select } from "antd";
import type { Task } from "../../../../app/api/types";
import { toNaiveISOString } from "../../../../app/utils";
import type { InputStatus } from "antd/es/_util/statusUtils";
import { useState } from "react";
import { DatePickerWithStatus } from "./DatePickerWithStatus";

type FormDataTask = Omit<Task, 'id'>;

const defaultFormData: FormDataTask = {
   name: '',
   description: '',
   startDate: toNaiveISOString(new Date()),
   endDate: toNaiveISOString(new Date((new Date()).getTime() + 7*1000*60*60*24)),
   status: 'process',
   project_id: '',
};


interface FormTaskProps {
   project_id: string;
   handelCancel: () => void;
   handelOk: (updateProject: Omit<Task, 'id'>, isEditMode?: boolean) => void;
}

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

export function FormTask({ project_id, handelCancel, handelOk }: FormTaskProps) {
   const [ formData, setFormData ] = useState<FormDataTask>({...defaultFormData, project_id: project_id});
   const [ dateStatus, setDateStatus ] = useState<DateStatus>(defaultDateStatus);

   const errorMessage = 'Дата начала задачи должны быть меньше его окончания';

   async function hOk() {
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
         handelOk(formData);
         setFormData(defaultFormData);
      }
   }

   return(
      <>
         <Form style={{ paddingTop: 10 }}>
            <Form.Item className="w-full flex flex-col gap-1">
               <span>Название</span>
               <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
               />
            </Form.Item>
            <Form.Item className="w-full flex flex-col gap-1">
               <span>Описание</span>
               <Input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
               />
            </Form.Item>
            <Form.Item className="w-full flex flex-col gap-1">
               <span>Статус</span>
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
            </Form.Item>
            <Form.Item className="w-full flex flex-col gap-1">
               <span>Сроки</span>
               <div className="w-full flex gap-5">
                  <div className="w-full">
                     <span className="text-gray-600">Начало</span>
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
                  <div className="w-full">
                     <span className="text-gray-600">Конец</span>
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
            </Form.Item>
         </Form>         
         <div className="flex justify-end gap-2">
            <Button
               onClick={() => {
                  handelCancel();
                  setFormData(defaultFormData);
               }}
            >
               Отмена
            </Button>
            <Button
               type="primary"
               onClick={() => {
                  hOk();
               }}
               disabled={!(!!formData.name && !!formData.description)}
            >
               Подтвердить
            </Button>
         </div>
      </>
   );
}