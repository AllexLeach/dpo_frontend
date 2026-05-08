import { useState } from "react";
import { useRole } from "./RoleContext";
import { Modal, Segmented } from "antd";

interface ModalRoleSwitcherProps {
   modalOpen: boolean;
   setModalOpen: (e: boolean) => void;
}

export function ModalRoleSwitcher({ modalOpen, setModalOpen }: ModalRoleSwitcherProps) {
   const { role, setRole } = useRole();
   const [ localRole, setLocalRole ] = useState<'user' | 'admin'>(role);

   return (
      <Modal
         open={modalOpen}
         afterOpenChange={() => {
            setLocalRole(role);
         }}
         onCancel={() => setModalOpen(false)}
         onOk={() => {
            setRole(localRole);
            setModalOpen(false);
         }}
      >
         <Segmented
            value={localRole}
            onChange={(value) => setLocalRole(value as 'user' | 'admin')}
            options={[
               { label: '👤 Пользователь', value: 'user' },
               { label: '👑 Администратор', value: 'admin' },
            ]}
         />
      </Modal>
   );
};