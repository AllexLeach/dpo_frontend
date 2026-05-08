import { DatePicker, Popover } from "antd";
import dayjs from "dayjs";
import { toNaiveISOString } from "../../../../app/utils";
import { useState } from "react";
import type { InputStatus } from "antd/es/_util/statusUtils";
import type { RenderFunction } from "antd/es/_util/getRenderPropValue";

type ActionType = 'hover'
   | 'focus'
   | 'click'
   | 'contextMenu';

type TooltipPlacement = 'top'
   | 'left'
   | 'right'
   | 'bottom'
   | 'topLeft'
   | 'topRight'
   | 'bottomLeft'
   | 'bottomRight'
   | 'leftTop'
   | 'leftBottom'
   | 'rightTop'
   | 'rightBottom';

interface PopoverProps {
   title?: React.ReactNode | RenderFunction;
   content?: React.ReactNode | RenderFunction;
   onOpenChange?: (open: boolean, e?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLDivElement>) => void;
   trigger?: ActionType | ActionType[];
   placement?: TooltipPlacement;
   open?: boolean;
}

interface DatePickerWithStatusProps {
   status?: InputStatus;
   popoverProps?: PopoverProps;
   value?: string;
   onChange?: (dateStr: string, status?: InputStatus) => void;
   onClick?: () => void;
   disabled?: boolean;
}

export function DatePickerWithStatus({ value, onChange, status, popoverProps, onClick, disabled }: DatePickerWithStatusProps) {
   const [dateTime, setDateTime] = useState<string>(toNaiveISOString(new Date()));
   
   return(
      <div className='w-full flex flex-col gap-1'>
         {popoverProps?
            <Popover {...popoverProps} >
                  <DatePicker
                     status={status}
                     className='w-full'
                     value={dayjs(value? value: dateTime)}
                     onClick={onClick}
                     onChange={(_, dateStr) => {
                        const newDate = toNaiveISOString(new Date(dateStr as string));
                        const date = newDate.match(/\d{4}-\d{2}-\d{2}/i)?.[0];
                        onChange? onChange(date!): setDateTime(date!);
                     }}
                     allowClear={false}
                     disabled={disabled}
                  />
            </Popover>
         :
            <DatePicker
                  status={status}
                  className='w-full'
                  value={dayjs(value? value: dateTime)}
                  onChange={(_, dateStr) => {
                     const newDate = toNaiveISOString(new Date(dateStr as string));
                     const date = newDate.match(/\d{4}-\d{2}-\d{2}/i)?.[0];
                     onChange? onChange(date!): setDateTime(date!);
                  }}
                  allowClear={false}
                  disabled={disabled}
            />
         }
      </div>
   );
}