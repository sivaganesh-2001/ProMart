import React from "react";
import Sidebar from "../../components/admin/Sidebar";
import Dashboard from "../../components/admin/Dashboard";

function AdminHome() {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <Dashboard />
    </div>
  );
}

export default AdminHome;
