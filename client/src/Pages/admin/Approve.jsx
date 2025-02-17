import React from "react";
import Sidebar from "../../components/admin/Sidebar";
import ApproveSeller from "../../components/admin/ApproveSeller";

function Approve() {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <ApproveSeller />
    </div>
  );
}

export default Approve;
