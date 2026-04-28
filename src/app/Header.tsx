import { Button } from "antd";
import { CgProfile } from "react-icons/cg";
import { LuConstruction } from "react-icons/lu";
import { NavLink } from "react-router";

export default function Header() {
   
   return(
      <div
         className='z-50 h-auto w-full flex justify-between items-center bg-[#ffffff] box-border gap-4 md:gap-0'
         style={{ padding: 10 }}
      >
         <NavLink
            title="К списку рабочих мест"
            to="/"
            className="text-black text-xl md:text-2xl text-center md:text-left"
         >
            <div className="flex flex-row justify-start items-center gap-2">
               <Button
                  style={{ padding: '0 10px' }}
                  icon={<LuConstruction color={'#1677FF'} size={25}/>}
                  type='text'
                  size='large'
                  className='flex justify-center items-center'
               ><span className="text-[20px] text-[#1677FF]" style={{ fontWeight: 'bold', marginTop: '-2.5px' }}>ЦифроСтрой</span></Button>
            </div>
         </NavLink>
         <div style={{ padding: '0 10px' }}>
            <Button
               type="primary"
               size="large"
               shape="circle"
               icon={<CgProfile />}
               className="self-center"
            />
         </div>
      </div>
   );
}