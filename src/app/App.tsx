import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import { AppLayout } from "./AppLayout";
import {
   Projects,
   ProjectPage
} from "../features/Projects";

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
               <Route path="/:id" element={<ProjectPage />} />
            </Route>
         </Routes>
      </>
   );
}

export default function App() {
   return (
      <BrowserRouter>
         <AppRouter />
      </BrowserRouter>
   );
}