import React from "react";
import Sidebar from "../../components/admin/Sidebar";
import Customers from "../../components/admin/Customers";
import AdminTopbar from "../../components/admin/adminTopbar";

function Customer() {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {/* Topbar */}
      <AdminTopbar />

      {/* Main Content - Sidebar & Customers */}
      <div className="flex flex-1">
        <Sidebar />
        <Customers />
      </div>
    </div>
  );
}

export default Customer;
