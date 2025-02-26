import React from "react";
import Sidebar from "../../components/admin/Sidebar";
import Sellers from "../../components/admin/Sellers";

function Seller() {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <Sellers />
    </div>
  );
}

export default Seller;