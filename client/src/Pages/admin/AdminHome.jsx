import React from "react";
import Sidebar from "../../components/admin/Sidebar";
import Dashboard from "../../components/admin/Dashboard";
import AdminTopbar from "../../components/admin/adminTopbar";

function AdminHome() {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {/* Topbar */}
      <AdminTopbar />

      {/* Main Content - Sidebar & Dashboard */}
      <div className="flex flex-1">
        <Sidebar />
        <Dashboard />
      </div>
    </div>
  );
}

export default AdminHome;
