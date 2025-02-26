import React from "react";
import Sidebar from "../../components/admin/Sidebar";
import Customers from "../../components/admin/Customers";

function Customer() {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <Customers />
    </div>
  );
}

export default Customer;