import React from "react";
import { Outlet } from "react-router-dom";

const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-0">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
