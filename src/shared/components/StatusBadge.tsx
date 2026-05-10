import type { ReactNode } from "react";
import type { ProjectStatus } from "../../app/api/types";

interface StatusConfigField {
   bg: string;
   text: string;
   color: string;
}

const defaultStatusConfig: Record<ProjectStatus, StatusConfigField> = {
   active: { bg: '#E6F4FF', text: 'Активный', color: '#1677FF' },
   done: { bg: '#E6FFE6', text: 'Завершён', color: '#00cd12' },
   paused: { bg: '#FFF7E6', text: 'Приостановлен', color: '#e3aa00' },
   canceled: { bg: '#FFE6E6', text: 'Отменён', color: '#cd0000' },
} as const;

interface StatusBadgeProps<T extends string | number | symbol = ProjectStatus> {
   status: T;
   text?: ReactNode;
   config?: Record<T, Partial<StatusConfigField>>;
}

// ну что за имба? когда лень один тип в api/types поправить чисто)))
// так-то штука мега полезная и расширяемая что большой +
export function StatusBadge<T extends string | number | symbol = ProjectStatus>({ status, text, config = {} as Record<T, Partial<StatusConfigField>> }: StatusBadgeProps<T>) {
   const defaultConfigForType = (defaultStatusConfig as Record<string, StatusConfigField>);
   const defaultForStatus = defaultConfigForType[status as string] || { bg: '#f5f5f5', text: String(status), color: '#666' };
   
   const customForStatus = config[status] || {};
   
   const mergedConfigField: StatusConfigField = {
      bg: customForStatus.bg ?? defaultForStatus.bg,
      color: customForStatus.color ?? defaultForStatus.color,
      text: customForStatus.text ?? defaultForStatus.text,
   };

   return (
      <div
         className="rounded-md text-sm font-medium inline-block"
         style={{
            padding: '5px 10px',
            background: mergedConfigField.bg,
            color: mergedConfigField.color,
         }}
      >
         {text || mergedConfigField.text}
      </div>
   );
}