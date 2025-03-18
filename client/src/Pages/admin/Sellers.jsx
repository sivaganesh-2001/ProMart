import React from "react";
import Sidebar from "../../components/admin/Sidebar";
import Sellers from "../../components/admin/Sellers";
import AdminTopbar from "../../components/admin/adminTopbar";

function Seller() {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {/* Topbar */}
      <AdminTopbar />

      {/* Main Content - Sidebar & Sellers */}
      <div className="flex flex-1">
        <Sidebar />
        <Sellers />
      </div>
    </div>
  );
}

export default Seller;
  