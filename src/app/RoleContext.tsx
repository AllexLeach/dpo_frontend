import { createContext, useContext, useState, type ReactNode } from 'react';

type Role = 'user' | 'admin';

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  isAdmin: boolean;
}

const RoleContext = createContext<RoleContextType | null>(null);

function getInitialRole(): Role {
   const stored = localStorage.getItem('role');
   if (stored === 'admin' || stored === 'user') return stored;
   return 'user';
};

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>(getInitialRole());
  const isAdmin = role === 'admin';

  return (
    <RoleContext.Provider
      value={{
         role,
         setRole: (role) => {
            localStorage.setItem('role', role);
            setRole(role);
         },
         isAdmin
      }}>
      {children}
    </RoleContext.Provider>
  );
};

export function useRole() {
   const ctx = useContext(RoleContext);
   if (!ctx) throw new Error('useRole must be used within RoleProvider');
   return ctx;
};