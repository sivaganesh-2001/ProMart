import React from "react";
import Sidebar from "../../components/admin/Sidebar";
import ApproveSeller from "../../components/admin/ApproveSeller";
import AdminTopbar from "../../components/admin/adminTopbar";

function Approve() {
  return (
   <div className="bg-gray-100 min-h-screen flex flex-col">
       {/* Topbar */}
       <AdminTopbar />
 
       {/* Main Content - Sidebar & Dashboard */}
       <div className="flex flex-1">
      <Sidebar />
      <ApproveSeller />
    </div>
    </div>
  );
}

export default Approve;
