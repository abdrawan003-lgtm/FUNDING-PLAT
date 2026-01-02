import { useState } from "react";
import Sidebar from "./Sidebar/sidebar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  const [open, setOpen] = useState(false);

    const toggleSidebar = () => setOpen(prev => !prev);
  return (
    <>
      {/* زر القائمة */}
      <button className="button" 
        onClick={toggleSidebar}
        style={{
          position: "fixed",
          top: "15px",
          left: "15px",

          fontSize: "26px",
          zIndex: 1200,
          background: "none",
          color:"#fff",
          border:"none",
          cursor: "pointer",
          
         
        }}
      >
        ☰
      </button>

      {/* السايد بار */}
      <Sidebar isOpen={open} onClose={() => setOpen(false)}  />

      {/* محتوى الصفحات */}
      <Outlet />
    </>
  );
}
