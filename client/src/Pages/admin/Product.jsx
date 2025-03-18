import React from "react";
import Sidebar from "../../components/admin/Sidebar";
import Products from "../../components/admin/Products";
import AdminTopbar from "../../components/admin/adminTopbar";

function Product() {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {/* Topbar */}
      <AdminTopbar />

      {/* Main Content - Sidebar & Products */}
      <div className="flex flex-1">
        <Sidebar />
        <Products />
      </div>
    </div>
  );
}

export default Product;
