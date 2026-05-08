import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import { AppLayout } from "./AppLayout";
import {
   Projects,
   ProjectPage
} from "../features/Projects";
import { RoleProvider } from "./RoleContext";
import { db } from "./db/database";
import { mockProjects, mockTasks } from "./db/mockData";
import { Spin } from "antd";

export const ScrollToTop = () => {
   const { pathname } = useLocation();

   // пути для которых не нужен скролл вверх
   const EXCLUDED_PATHS: string[] = [];

   useEffect(() => {
      const shouldScroll = !EXCLUDED_PATHS.some(path => 
         pathname.startsWith(path)
      );

      if (shouldScroll) {
         window.scrollTo(0, 0);
      }
   }, [pathname]); // Срабатывает при каждом изменении пути

   return null; // Ничего не рендерит
};

function AppRouter() {
   return (
      <>
         <ScrollToTop />
         <Routes>
            <Route element={<AppLayout />}>
               <Route path="/" element={<Projects />} />
               <Route path="/:projectId" element={<ProjectPage />} />
            </Route>
         </Routes>
      </>
   );
}

export default function App() {
   const [isReady, setIsReady] = useState(false);

   useEffect(() => {
      const init = async () => {
         try {
            const projectCount = await db.projects.count();
            if (projectCount === 0) {
               await db.projects.bulkAdd(mockProjects); // ошибка в npm run dev из-за StrictMode
               await db.tasks.bulkAdd(mockTasks);
            }
         } catch (error) {
            console.error(error);
         } finally {
            setIsReady(true);
         }
      };
      
      init();
   }, []);

   if (!isReady) {
      return (
         <div className="h-screen w-full flex items-center justify-center">
            <Spin size="large" />
         </div>
      );
   }

   return (
      <RoleProvider> 
         <BrowserRouter>
            <AppRouter />
         </BrowserRouter>
      </RoleProvider>
   );
}