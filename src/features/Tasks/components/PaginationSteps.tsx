import { Button, Steps, type StepsProps } from "antd";
import { useEffect, useState } from "react";
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";

interface PaginationStepsProps {
   items: Required<StepsProps>['items'];
   currentTaskIndex: number;
   setCurrentTaskIndex: (e: number) => void;
}

interface ItemsRange {
   start: number;
   end: number;
}

export function PaginationSteps({ items, currentTaskIndex, setCurrentTaskIndex }: PaginationStepsProps) {
   const [ itemsRange, setItemsRange ] = useState<ItemsRange>({
      start: 0,
      end: items.length > 5? 4: items.length-1
   });

   useEffect(() => {
      if (items.length >= 5) {
         if (currentTaskIndex > itemsRange.end) {
            setItemsRange({
               start: currentTaskIndex,
               end: currentTaskIndex+4 > items.length-1? items.length-1: currentTaskIndex+4
            });
         }
         if (currentTaskIndex < itemsRange.start) {
            setItemsRange({
               start: currentTaskIndex < 4? 0: currentTaskIndex-4,
               end: currentTaskIndex < 4? 4: currentTaskIndex
            });
         }
      }
   }, [currentTaskIndex]);
   
   return(
      <div className="w-full flex justify-between items-center gap-2">
         {items.length > 5 && itemsRange.start > 0? <Button
            shape="circle"
            icon={<BiLeftArrowAlt />}
            onClick={() => handelMove('left')}
         />: null}
         <Steps
            className="w-full"
            type="navigation"
            size="small"
            current={currentTaskIndex-itemsRange.start}
            onChange={(value) => {
               setCurrentTaskIndex(itemsRange.start+value)
            }}
            items={[...items].splice(itemsRange.start, 5)}
         />
         {items.length > 5 && itemsRange.end < items.length-1? <Button
            shape="circle"
            icon={<BiRightArrowAlt />}
            onClick={() => handelMove('right')}
         />: null}
      </div>
   );

   function handelMove(side: 'right' | 'left') {
      if (side === 'right') {
         setCurrentTaskIndex(itemsRange.end+1);
      } else {
         setCurrentTaskIndex(itemsRange.start-1);
      }
   }
}